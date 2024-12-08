package vn.apartment.notification.dao;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import vn.apartment.notification.document.Template;

@Repository
public interface TemplateRepo extends MongoRepository<Template, String> {
}
