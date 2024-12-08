import os
import weaviate
import torch
from dotenv import load_dotenv
from transformers import T5ForConditionalGeneration, T5Tokenizer
import re

# Load environment variables
load_dotenv()

# Weaviate configuration
WEAVIATE_URL = os.getenv("WEAVIATE_URL", "http://localhost:8090")

# Global tokenizer and model initialization
TOKENIZER = T5Tokenizer.from_pretrained('google/flan-t5-large')
MODEL = T5ForConditionalGeneration.from_pretrained('google/flan-t5-large')

def connect_to_weaviate():
    """Connect to Weaviate"""
    try:
        return weaviate.Client(url=WEAVIATE_URL)
    except Exception as e:
        print(f"Weaviate connection error: {e}")
        raise

def create_weaviate_schema():
    try:
        client = connect_to_weaviate()
        
        # Check and delete existing schema
        if client.schema.exists("Question"):
            client.schema.delete_class("Question")
        
        # Create new schema with improved indexing
        schema = {
            "class": "Question",
            "vectorIndexType": "hnsw",
            "vectorizer": "text2vec-transformers",
            "properties": [
                {"name": "question", "dataType": ["text"], "indexSearchable": True, "indexFilterable": True},
                {"name": "answer", "dataType": ["text"], "indexSearchable": True},
                {"name": "category", "dataType": ["text"], "indexFilterable": True},
                {"name": "exact_match_keywords", "dataType": ["text"], "indexSearchable": True},
                {"name": "metadata", "dataType": ["text"]}
            ]
        }
        client.schema.create_class(schema)
        print("Enhanced Weaviate schema created successfully.")
    except Exception as e:
        print(f"Schema creation error: {e}")

def preprocess_query(query: str):
    """Advanced query preprocessing with exact match support"""
    # Convert to lowercase and remove special characters
    query = query.lower()
    query = re.sub(r'[^\w\s]', '', query)
    
    # Normalize query variations
    variations = {
        'tell me about': '',
        'what are': 'what',
        'list of': '',
        'describe the': '',
        'who developed': 'who develop',
        'developed by': 'develop',
    }
    
    for phrase, replacement in variations.items():
        query = query.replace(phrase, replacement)
    
    return query.strip()

def _extract_exact_match_keywords(text: str):
    """Extract exact match keywords for precise retrieval"""
    # Extract full names, key terms, and important identifiers
    keywords = []
    
    # Extract full names
    name_pattern = r'\b([A-Z][a-z]+ [A-Z][a-z]+ [A-Z][a-z]+)\b'
    names = re.findall(name_pattern, text)
    keywords.extend([name.lower() for name in names])
    
    # Extract key terms and organizations
    key_terms_pattern = r'\b([A-Z][a-z]+(?:\s[A-Z][a-z]+)+)\b'
    key_terms = re.findall(key_terms_pattern, text)
    keywords.extend([term.lower() for term in key_terms if term.lower() not in [name.lower() for name in names]])
    
    # Add specific keywords from the text
    additional_keywords = []
    for word in text.lower().split():
        if len(word) > 3 and word not in keywords:
            additional_keywords.append(word)
    
    # Combine and deduplicate
    keywords.extend(additional_keywords)
    return list(set(keywords))

def add_document(question: str, answer: str, category: str = "General", metadata: str = ""):
    """Enhanced document addition with exact match keywords"""
    try:
        client = connect_to_weaviate()
        
        # Generate exact match keywords
        exact_match_keywords = _extract_exact_match_keywords(question + " " + answer)
        print(f"Exact match keywords: {exact_match_keywords}")
        
        # Adjust document to match schema
        document = {
            "title": question,
            "content": answer
        }

        # Add document to Weaviate
        client.data_object.create(document, class_name="Document")
        print(f"Document added: {question}")
        return True
    except Exception as e:
        print(f"Document addition error: {e}")
        if hasattr(e, 'message'):
            print(f"Error message: {e.message}")
        return False

def query_documents(query: str, limit: int = 3, similarity_threshold: float = 0.5):
    """Enhanced multi-strategy document retrieval with exact match priority"""
    try:
        client = connect_to_weaviate()
        
        # Preprocess the query
        processed_query = preprocess_query(query)
        
        # Extract exact match keywords from the query
        query_keywords = _extract_exact_match_keywords(query)
        
        # Query strategies with weighted approach
        query_strategies = [
            # 1. Exact match with keywords
            lambda q, kw: client.query.get("Document", 
                ["title", "content", "exact_match_keywords"]) \
                .with_where({
                    "path": ["exact_match_keywords"],
                    "operator": "ContainsAny",
                    "valueText": kw
                }) \
                .with_limit(limit) \
                .with_additional(["certainty", "score"]) \
                .do(),
            
            # 2. Semantic search with broader context (now correctly querying "Document")
            lambda q, kw: client.query.get("Document", 
                ["title", "content", "exact_match_keywords"]) \
                .with_near_text({"concepts": [q]}) \
                .with_where({
                    "path": ["exact_match_keywords"],
                    "operator": "ContainsAny", 
                    "valueText": kw
                }) \
                .with_limit(limit) \
                .with_additional(["certainty", "score"]) \
                .do()
        ]
        
        # Try each query strategy
        for strategy in query_strategies:
            response = strategy(processed_query, query_keywords)
            
            # Filter and rank documents (changed "Question" to "Document")
            documents = [
                doc for doc in response["data"]["Get"]["Document"] 
                if (doc["_additional"]["certainty"] >= similarity_threshold)
            ]
            
            # Sort by certainty and relevance
            documents.sort(key=lambda x: (
                x["_additional"]["certainty"], 
                x["_additional"].get("score", 0)
            ), reverse=True)
            
            if documents:
                return documents
        
        return []
    except Exception as e:
        print(f"Document query error: {e}")
        return []


def generate_answer(context: str, query: str, use_context: bool = True):
    """Improved answer generation with precise context matching"""
    try:
        # If context is available, use it for precise answering
        if use_context and context:
            input_text = f"Context: {context}\n\nQuestion: {query}\n\nUsing ONLY the information from the context, provide a direct and concise answer. If no specific information is found, clearly state that."
            
            # Tokenize and generate answer with context
            inputs = TOKENIZER(input_text, return_tensors="pt", max_length=1024, truncation=True, padding="longest")
            outputs = MODEL.generate(
                inputs['input_ids'], 
                max_length=1024,  # Very concise answer 
                num_beams=4, 
                early_stopping=True, 
                no_repeat_ngram_size=2,
                temperature=0.3  # Extremely conservative to stick to context
            )
            
            answer = TOKENIZER.decode(outputs[0], skip_special_tokens=True)
            
            # Strict filtering of non-informative responses
            if not answer or len(answer.split()) < 3 or any(phrase in answer.lower() for phrase in [
                "i don't have", "no specific", "cannot find", "not found", 
                "unable to determine", "no information"
            ]):
                return "No specific information found in the available documents."
            
            return answer
        
        # Fallback to direct model-based answering
        input_text = f"Provide a clear, direct answer to the following question: {query}"
        inputs = TOKENIZER(input_text, return_tensors="pt", max_length=1024, truncation=True)
        outputs = MODEL.generate(
            inputs['input_ids'], 
            max_length=1024, 
            num_beams=4, 
            early_stopping=True, 
            temperature=0.7
        )
        
        return TOKENIZER.decode(outputs[0], skip_special_tokens=True)
    
    except Exception as e:
        print(f"Answer generation error: {e}")
        return "Unable to generate a precise answer."


def generate_response(query: str, limit: int = 3, similarity_threshold: float = 0.5):
    """Refined RAG process with improved context retrieval and answer generation"""
    # Preprocess query
    processed_query = preprocess_query(query)
    
    # Find relevant documents
    documents = query_documents(processed_query, limit, similarity_threshold)
    
    # If no relevant documents found, use pure model generation
    if not documents:
        return generate_answer("", query, use_context=False)
    
    # Create context from most relevant documents
    context = []
    for doc in documents:
        # Prioritize full answer, include question for additional context
        context_entry = ""
        if doc.get('answer'):
            context_entry = f"Relevant Answer: {doc['answer']}"
        if doc.get('question'):
            context_entry += f" (From Question: {doc['question']})"
        
        context.append(context_entry)
    
    # Join context, use the most relevant information
    context_text = "\n".join(context)
    
    # Generate response with context
    return generate_answer(context_text, query)

def print_all_documents():
    """Print all documents in the system"""
    try:
        client = connect_to_weaviate()
        response = client.query.get("Document", ["question", "answer", "category", "exact_match_keywords", "metadata"]).do()
        documents = response["data"]["Get"]["Question"]
        print(f"Total documents: {len(documents)}")
        for doc in documents:
            print("Question:", doc.get('question', 'N/A'))
            print("Answer:", doc.get('answer', 'N/A'))
            print("Category:", doc.get('category', 'N/A'))
            print("Exact Match Keywords:", doc.get('exact_match_keywords', 'N/A'))
            print("---")
    except Exception as e:
        print(f"Document retrieval error: {e}")

def main():
    # Create schema
    create_weaviate_schema()
    
    # Add document about development team
    add_document(
        "Who developed the Apartment Management System?", 
        "The Apartment Management System was developed by three students: Bui Quoc Thong, Nguyen Hoai Lam, and Tran Gia Huy.",
        "Development Team of Apartment Management System",
        "Student project team"
    )
    
    # Test queries
    test_queries = [
        "Who developed the Apartment Management System?",
        "Tell me about the system's developers",
        "Names of people who created the system"
    ]
    
    # Perform queries and print results
    for query in test_queries:
        print(f"\nQuery: {query}")
        response = generate_response(query)
        print(f"Response: {response}")

if __name__ == "__main__":
    main()