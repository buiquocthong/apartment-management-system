package vn.apartment.notification.loader;

import java.io.Reader;
import java.io.StringReader;

import freemarker.cache.TemplateLoader;

import org.springframework.beans.factory.annotation.Autowired;

import vn.apartment.notification.document.Template;
import vn.apartment.notification.service.TemplateService;

public class MongoTemplateLoader implements TemplateLoader {

    @Autowired
    private TemplateService templateService;

    @Override
    public Template findTemplateSource(String name) {
        return templateService.findById(name);
    }

    @Override
    public long getLastModified(Object templateSource) {
        return ((Template) templateSource).getUpdatedAt().getTime();
    }

    @Override
    public Reader getReader(Object templateSource, String encoding) {
        return new StringReader(((Template) templateSource).getContent());
    }

    @Override
    public void closeTemplateSource(Object templateSource) {

    }
}
