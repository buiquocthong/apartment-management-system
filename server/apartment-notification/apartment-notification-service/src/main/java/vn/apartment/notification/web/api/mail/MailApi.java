package vn.apartment.notification.web.api.mail;

import javax.validation.Valid;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import vn.apartment.core.model.anotation.ApiQueryParams;
import vn.apartment.core.model.api.ApiError;
import vn.apartment.core.mvc.security.core.PermissionSecurity;
import vn.apartment.notification.dto.constant.NotificationAPIs;
import vn.apartment.notification.dto.mail.*;
import vn.apartment.notification.interactor.mail.ListMail;
import vn.apartment.notification.interactor.mail.ScheduleMail;

@RestController
@RequestMapping(NotificationAPIs.MAIL_API)
@Tag(name = "Mails", description = "Mails API Endpoints")
public class MailApi {

    @Autowired
    private ScheduleMail scheduleMail;
    @Autowired
    private ListMail listMail;
    @Autowired
    private PermissionSecurity permissionSecurity;

    @Operation(summary = "Schedule Mail")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MailResult schedule(@Valid @RequestBody MailDTO mailDTO) {
        return scheduleMail.execute(mailDTO);
    }

    @ApiQueryParams
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Success",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = MailPageDTO.class))}
        ),
        @ApiResponse(responseCode = "401", description = "Unauthorized",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = ApiError.class))}
        ),
        @ApiResponse(responseCode = "403", description = "Forbidden",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = ApiError.class))}
        ),
        @ApiResponse(responseCode = "500", description = "Unexpected Error",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = ApiError.class))}
        )
    })
    @GetMapping
    @PreAuthorize("@permissionSecurity.hasPrivileges('NOTIFICATION_MAIL','VIEW')")
    public MailPageDTO listMails(@Parameter(hidden = true) @ModelAttribute MailQuery mailQuery) {

        return listMail.execute(mailQuery);
    }
}
