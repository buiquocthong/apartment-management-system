package vn.apartment.master.web.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import vn.apartment.core.model.anotation.ApiQueryParams;
import vn.apartment.core.model.anotation.AuditAction;
import vn.apartment.core.model.api.ApiError;
import vn.apartment.core.model.api.ApiQuery;
import vn.apartment.core.model.exception.InvalidParameterException;
import vn.apartment.master.dto.apartment.AddApartmentDTO;
import vn.apartment.master.dto.apartment.ApartmentDTO;
import vn.apartment.master.dto.apartment.ApartmentPageDTO;
import vn.apartment.master.dto.apartment.UpdateApartmentDTO;
import vn.apartment.master.dto.constant.MasterAPIs;
import vn.apartment.master.dto.invoice.InvoiceDTO;
import vn.apartment.master.dto.servicedetail.ServiceDetailDTO;
import vn.apartment.master.interactor.apartment.*;
import vn.apartment.master.interactor.invoice.FindLastedInvoiceByApartment;
import vn.apartment.master.interactor.invoice.ListHistoryInvoiceByApartment;
import vn.apartment.master.interactor.servicedetail.ListServiceDetailsByApartment;


import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping(MasterAPIs.APARTMENT_API)
@Tag(name = "Apartments", description = "Apartment API Endpoints")
public class ApartmentApi {
    @Autowired
    private AddApartment addApartment;
    @Autowired
    private FindApartment findApartment;
    @Autowired
    private ListApartment listApartment;
    @Autowired
    private UpdateApartment updateApartment;
    @Autowired
    private RemoveApartment removeApartment;
    @Autowired
    private ListServiceDetailsByApartment listServiceDetailsByApartment;
    @Autowired
    private ListHistoryInvoiceByApartment listHistoryInvoiceByApartment;
    @Autowired
    private FindLastedInvoiceByApartment findLastedInvoiceByApartment;

    @Operation(summary = "Add Apartment")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "401", description = "Unauthorized",
                    content = {@Content(mediaType = "application/json", schema = @Schema(implementation = ApiError.class))}
            ),
            @ApiResponse(responseCode = "400", description = "Apartment already existed or Invalid Request Parameter",
                    content = {@Content(mediaType = "application/json", schema = @Schema(implementation = ApiError.class))}
            ),
            @ApiResponse(responseCode = "500", description = "Unexpected Error",
                    content = {@Content(mediaType = "application/json", schema = @Schema(implementation = ApiError.class))}
            )
    })
    @PostMapping()
    @ResponseStatus(HttpStatus.CREATED)
    @AuditAction("ADD_APARTMENT")
    @PreAuthorize("@permissionSecurity.hasPrivileges('APARTMENT','ADD/UPDATE')")
    public ResponseEntity<String> addApartment(@Valid @RequestBody AddApartmentDTO apartmentDTO) {
        if (apartmentDTO == null) {
            throw new InvalidParameterException("Missing apartment request body");
        }
        addApartment.execute(apartmentDTO);
        return new ResponseEntity<>("add apartment successfully",HttpStatus.CREATED);
    }

    @Operation(summary = "Update Apartment")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "401", description = "Unauthorized",
                    content = {@Content(mediaType = "application/json", schema = @Schema(implementation = ApiError.class))}
            ),
            @ApiResponse(responseCode = "404", description = "Not found",
                    content = {@Content(mediaType = "application/json", schema = @Schema(implementation = ApiError.class))}
            ),
            @ApiResponse(responseCode = "500", description = "Unexpected Error",
                    content = {@Content(mediaType = "application/json", schema = @Schema(implementation = ApiError.class))}
            )
    })
    @PutMapping(value = "/{apartmentId}")
    @ResponseStatus(HttpStatus.OK)
    @AuditAction("UPDATE_APARTMENT")
    @PreAuthorize("@permissionSecurity.hasPrivileges('APARTMENT','ADD/UPDATE')")
    public ResponseEntity<String> updateApartment(@PathVariable("apartmentId") String apartmentId, @RequestBody UpdateApartmentDTO apartmentDTO) {
        apartmentDTO.setApartmentId(apartmentId);
        updateApartment.execute(apartmentDTO);
        return new ResponseEntity<>("update apartment successfully",HttpStatus.CREATED);
    }

    @Operation(summary = "Find Apartment")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Success",
                    content = {@Content(mediaType = "application/json", schema = @Schema(implementation = ApartmentDTO.class))}
            ),
            @ApiResponse(responseCode = "401", description = "Unauthorized",
                    content = {@Content(mediaType = "application/json", schema = @Schema(implementation = ApiError.class))}
            ),
            @ApiResponse(responseCode = "404", description = "Not found",
                    content = {@Content(mediaType = "application/json", schema = @Schema(implementation = ApiError.class))}
            ),
            @ApiResponse(responseCode = "500", description = "Unexpected Error",
                    content = {@Content(mediaType = "application/json", schema = @Schema(implementation = ApiError.class))}
            )
    })
    @GetMapping(value = "/{apartmentId}")
    @PreAuthorize("@permissionSecurity.hasPrivileges('APARTMENT','VIEW')")
    public ApartmentDTO findApartment(@PathVariable(value = "apartmentId") String apartmentId) {
        return findApartment.execute(apartmentId);
    }

    @Operation(summary = "List Apartments")
    @Parameters(
            @Parameter(name = "sort_by", in = ParameterIn.QUERY,
                    schema = @Schema(type = "string", allowableValues = {"name"})
            )
    )
    @ApiQueryParams
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Success",
                    content = {@Content(mediaType = "application/json", schema = @Schema(implementation = ApartmentPageDTO.class))}
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
    @GetMapping()
    @PreAuthorize("@permissionSecurity.hasPrivileges('APARTMENT','VIEW')")
    public ApartmentPageDTO listApartments(@Parameter(hidden = true) @ModelAttribute ApiQuery query) {
        return listApartment.execute(query);
    }

    @DeleteMapping("/{apartmentId}")
    @PreAuthorize("@permissionSecurity.hasPrivileges('APARTMENT','REMOVE')")
    public ResponseEntity<String> removeApartment(@PathVariable("apartmentId") String apartmentId) {
        removeApartment.execute(apartmentId);
        return new ResponseEntity<>("remove apartment successfully", HttpStatus.OK);
    }

    @GetMapping("/{apartmentId}/service_details")
    @PreAuthorize("@permissionSecurity.hasPrivileges('SERVICE_DETAIL','VIEW')")
    public List<ServiceDetailDTO> listServiceDetails(@PathVariable String apartmentId) {
        return listServiceDetailsByApartment.execute(apartmentId);
    }

    @GetMapping("/{apartmentId}/history/invoices")
    @PreAuthorize("@permissionSecurity.hasPrivileges('INVOICE','VIEW')")
    public List<InvoiceDTO> listHistoryInvoices(@PathVariable String apartmentId) {
        return listHistoryInvoiceByApartment.execute(apartmentId);
    }

    @GetMapping("/{apartmentId}/invoice")
    @PreAuthorize("@permissionSecurity.hasPrivileges('INVOICE','VIEW')")
    public InvoiceDTO findApprovedInvoice(@PathVariable String apartmentId) {
        return findLastedInvoiceByApartment.execute(apartmentId);
    }
}
