package vn.apartment.core.model.anotation;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Schema;
import vn.apartment.core.model.api.ApiQuery;

import static java.lang.annotation.ElementType.ANNOTATION_TYPE;
import static java.lang.annotation.ElementType.METHOD;

@Parameters({
    @Parameter(
        name = "limit",
        in = ParameterIn.QUERY,
        description = "Num. items to be returned on per-page",
        schema = @Schema(name = "limit", type = "integer", format = "int32", defaultValue = "50")),
    @Parameter(
        name = "offset",
        in = ParameterIn.QUERY,
        description = "Sets a beginning range of items to return.",
        schema = @Schema(type = "integer", format = "int32", defaultValue = "0")),
    @Parameter(
        name = "direction",
        in = ParameterIn.QUERY,
        description = "Order by ascending (A-Z) or descending (Z-A).",
        schema = @Schema(type = "string", implementation = ApiQuery.Direction.class,
            allowableValues = {"ASC", "DESC"}, defaultValue = "ASC")),
    @Parameter(
        name = "query",
        in = ParameterIn.QUERY,
        description = "Search by record",
        schema = @Schema(type = "string"))}
)
@Target({METHOD, ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface ApiQueryParams {
}
