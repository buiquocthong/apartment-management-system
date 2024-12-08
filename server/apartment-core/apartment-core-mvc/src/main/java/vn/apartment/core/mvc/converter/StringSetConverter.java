package vn.apartment.core.mvc.converter;

import com.google.common.collect.Sets;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;
import java.util.Set;

@Converter
public class StringSetConverter implements AttributeConverter<Set<String>, String> {

    public static final String DELIMITER = ",";

    @Override
    public String convertToDatabaseColumn(Set<String> attributes) {
        if (attributes == null) {
            return null;
        }
        return String.join(DELIMITER, attributes);
    }

    @Override
    public Set<String> convertToEntityAttribute(String attribute) {
        if (attribute == null) {
            return null;
        }
        return Sets.newHashSet(attribute.split(DELIMITER));
    }
}
