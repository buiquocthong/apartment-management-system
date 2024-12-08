package vn.apartment.core.mvc.converter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import vn.apartment.core.model.audit.Editor;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;
import java.io.IOException;

@Converter
public class EditorJsonConverter implements AttributeConverter<Editor, String> {

    private static final Logger LOG = LoggerFactory.getLogger(EditorJsonConverter.class);

    private final static ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(Editor editor) {
        try {
            return OBJECT_MAPPER.writeValueAsString(editor);
        } catch (JsonProcessingException ex) {
            LOG.error("Unexpected serialize the Editor entity to json", editor);
            return null;
        }
    }

    @Override
    public Editor convertToEntityAttribute(String json) {
        try {
            return OBJECT_MAPPER.readValue(json, Editor.class);
        } catch (IOException ex) {
            LOG.error("Unexpected de-serialize the json string to Editor {}", json, ex);
            return null;
        }
    }
}
