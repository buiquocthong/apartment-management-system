package vn.apartment.api.gateway.exception;

import org.springframework.context.annotation.Configuration;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.boot.web.reactive.error.ErrorWebExceptionHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.MediaType;
import org.springframework.http.codec.HttpMessageReader;
import org.springframework.http.codec.HttpMessageWriter;
import org.springframework.http.codec.ServerCodecConfigurer;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.util.Assert;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.server.RequestPredicates;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import org.springframework.web.reactive.result.view.ViewResolver;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;
import vn.apartment.core.model.api.ApiError;
import vn.apartment.core.model.exception.ApiException;

@Configuration
public class GlobalExceptionHandler {

    private static final Logger LOG = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @Primary
    @Bean
    @Order(Ordered.HIGHEST_PRECEDENCE)
    public ErrorWebExceptionHandler errorWebExceptionHandler(ObjectProvider<List<ViewResolver>> viewResolversProvider,
                                                             ServerCodecConfigurer serverCodecConfigurer) {
        JsonExceptionHandler jsonExceptionHandler = new JsonExceptionHandler();
        jsonExceptionHandler.setViewResolvers(viewResolversProvider.getIfAvailable(Collections::emptyList));
        jsonExceptionHandler.setMessageWriters(serverCodecConfigurer.getWriters());
        jsonExceptionHandler.setMessageReaders(serverCodecConfigurer.getReaders());
        return jsonExceptionHandler;
    }

    public static class JsonExceptionHandler implements ErrorWebExceptionHandler {

        private List<HttpMessageReader<?>> messageReaders = Collections.emptyList();

        private List<HttpMessageWriter<?>> messageWriters = Collections.emptyList();

        private List<ViewResolver> viewResolvers = Collections.emptyList();

        private final ThreadLocal<Map<String, Object>> exceptionHandlerResult = new ThreadLocal<>();

        public void setMessageReaders(List<HttpMessageReader<?>> messageReaders) {
            Assert.notNull(messageReaders, "'messageReaders' must not be null");
            this.messageReaders = messageReaders;
        }

        public void setViewResolvers(List<ViewResolver> viewResolvers) {
            this.viewResolvers = viewResolvers;
        }

        public void setMessageWriters(List<HttpMessageWriter<?>> messageWriters) {
            Assert.notNull(messageWriters, "'messageWriters' must not be null");
            this.messageWriters = messageWriters;
        }

        @Override
        public Mono<Void> handle(ServerWebExchange exchange, Throwable ex) {

            ServerHttpRequest request = exchange.getRequest();
            LOG.error("Failed the request path: {}", request.getPath(), ex);

            ApiError apiError = ApiError.failed();

            if (ex instanceof ApiException) {
                apiError = new ApiError(((ApiException) ex).getError());
            }

            if (ex instanceof ResponseStatusException) {
                ResponseStatusException exception = (ResponseStatusException) ex;
                apiError = new ApiError(exception.getStatus().value(),
                    exception.getStatus().name(), exception.getMessage());
            }

            Map<String, Object> result = new HashMap<>(2, 1);
            result.put("httpStatus", apiError.getStatus());
            result.put("body", apiError);

            if (exchange.getResponse().isCommitted()) {
                return Mono.error(ex);
            }

            exceptionHandlerResult.set(result);
            ServerRequest newRequest = ServerRequest.create(exchange, this.messageReaders);

            return RouterFunctions.route(RequestPredicates.all(), this::renderErrorResponse).route(newRequest)
                .switchIfEmpty(Mono.error(ex))
                .flatMap((handler) -> handler.handle(newRequest))
                .flatMap((response) -> write(exchange, response));

        }

        protected Mono<ServerResponse> renderErrorResponse(ServerRequest request) {
            Map<String, Object> result = exceptionHandlerResult.get();
            return ServerResponse.status((int) result.get("httpStatus"))
                .contentType(MediaType.APPLICATION_JSON)
                .body(BodyInserters.fromObject(result.get("body")));
        }


        private Mono<? extends Void> write(ServerWebExchange exchange,
                                           ServerResponse response) {
            exchange.getResponse().getHeaders()
                .setContentType(response.headers().getContentType());
            return response.writeTo(exchange, new ResponseContext());
        }

        private class ResponseContext implements ServerResponse.Context {

            @Override
            public List<HttpMessageWriter<?>> messageWriters() {
                return JsonExceptionHandler.this.messageWriters;
            }

            @Override
            public List<ViewResolver> viewResolvers() {
                return JsonExceptionHandler.this.viewResolvers;
            }
        }
    }
}
