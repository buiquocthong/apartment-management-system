package vn.apartment.notification.conf;

import java.io.IOException;

import freemarker.cache.TemplateLookupContext;
import freemarker.cache.TemplateLookupResult;
import freemarker.cache.TemplateLookupStrategy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import vn.apartment.notification.loader.MongoTemplateLoader;

@Configuration
public class FreeMarkerConfig {

    @Bean
    public freemarker.template.Configuration freeMakerConfiguration() {
        freemarker.template.Configuration cfn = new
            freemarker.template.Configuration(freemarker.template.Configuration.VERSION_2_3_30);
        cfn.setDefaultEncoding("UTF-8");
        cfn.setTemplateLoader(mongoTemplateLoader());
        cfn.setTemplateLookupStrategy(new CustomTemplateLookupStrategy());
        return cfn;
    }

    public static class CustomTemplateLookupStrategy extends TemplateLookupStrategy {

        @Override
        public TemplateLookupResult lookup(TemplateLookupContext ctx) throws IOException {
            return ctx.lookupWithLocalizedThenAcquisitionStrategy(ctx.getTemplateName(), null);
        }
    }

    @Bean
    public MongoTemplateLoader mongoTemplateLoader() {
        return new MongoTemplateLoader();
    }

}
