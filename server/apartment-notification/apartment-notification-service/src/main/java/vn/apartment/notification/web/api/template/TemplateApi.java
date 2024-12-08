package vn.apartment.notification.web.api.template;

import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.apartment.notification.dto.constant.NotificationAPIs;

@RestController
@RequestMapping(NotificationAPIs.TEMPLATE_API)
@Tag(name = "Templates", description = "Templates API Endpoints")
public class TemplateApi {
}
