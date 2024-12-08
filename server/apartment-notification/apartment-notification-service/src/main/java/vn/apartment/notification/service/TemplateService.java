package vn.apartment.notification.service;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.apartment.core.model.exception.ResourceNotFoundException;
import vn.apartment.notification.dao.TemplateRepo;
import vn.apartment.notification.document.Template;


@Service
public class TemplateService {

    private static final Logger LOG = LoggerFactory.getLogger(TemplateService.class);

    @Autowired
    private TemplateRepo templateRepo;
    public Template findById(String templateId) {

        Optional<Template> hadTemplate = retrieveById(templateId);

        if (!hadTemplate.isPresent()) {
            throw new ResourceNotFoundException("The template by " + templateId + " not found.");
        }

        return hadTemplate.get();
    }
    public Optional<Template> retrieveById(final String templateId) {
        return templateRepo.findById(templateId);
    }
}
