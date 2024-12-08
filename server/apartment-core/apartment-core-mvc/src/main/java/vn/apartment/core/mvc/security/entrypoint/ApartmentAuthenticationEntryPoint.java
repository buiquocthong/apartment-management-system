package vn.apartment.core.mvc.security.entrypoint;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import vn.apartment.core.model.error.ErrorCode;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class ApartmentAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException exception) throws IOException {
        response.addHeader("WWW-Authenticate", "realm=Apartment");
        response.setCharacterEncoding("UTF-8");
        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, ErrorCode.UNAUTHORIZED.getMessage());
    }
}
