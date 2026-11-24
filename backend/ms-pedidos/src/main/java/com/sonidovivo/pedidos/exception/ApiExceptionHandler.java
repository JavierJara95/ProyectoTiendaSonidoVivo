package com.sonidovivo.pedidos.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.*;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import java.time.OffsetDateTime;
import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(RecursoNoEncontradoException.class)
    public ResponseEntity<Map<String, Object>> notFound(RecursoNoEncontradoException e, HttpServletRequest req) {
        return respond(HttpStatus.NOT_FOUND, e.getMessage(), req);
    }
    @ExceptionHandler({ReglaNegocioException.class, DataIntegrityViolationException.class})
    public ResponseEntity<Map<String, Object>> conflict(Exception e, HttpServletRequest req) {
        return respond(HttpStatus.CONFLICT, e instanceof DataIntegrityViolationException ? "Conflicto con los datos almacenados" : e.getMessage(), req);
    }
    @ExceptionHandler(IntegracionCatalogoException.class)
    public ResponseEntity<Map<String, Object>> catalogo(IntegracionCatalogoException e, HttpServletRequest req) {
        return respond(e.isConflicto() ? HttpStatus.CONFLICT : HttpStatus.BAD_GATEWAY, e.getMessage(), req);
    }
    @ExceptionHandler(IncidenciaStockException.class)
    public ResponseEntity<Map<String, Object>> incidencia(IncidenciaStockException e, HttpServletRequest req) {
        var body = error(e.isConflicto() ? HttpStatus.CONFLICT : HttpStatus.BAD_GATEWAY, e.getMessage(), req);
        body.put("folio", e.getFolio());
        return ResponseEntity.status(e.isConflicto() ? HttpStatus.CONFLICT : HttpStatus.BAD_GATEWAY).body(body);
    }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> invalid(MethodArgumentNotValidException e, HttpServletRequest req) {
        String fields = e.getBindingResult().getFieldErrors().stream()
                .map(x -> x.getField() + ": " + (x.getDefaultMessage() == null ? "inválido" : x.getDefaultMessage()))
                .distinct().collect(Collectors.joining("; "));
        return respond(HttpStatus.BAD_REQUEST, fields.isEmpty() ? "Solicitud inválida" : fields, req);
    }
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, Object>> badJson(HttpMessageNotReadableException e, HttpServletRequest req) {
        return respond(HttpStatus.BAD_REQUEST, "JSON inválido o estado desconocido", req);
    }
    private ResponseEntity<Map<String, Object>> respond(HttpStatus status, String msg, HttpServletRequest req) {
        return ResponseEntity.status(status).body(error(status, msg, req));
    }
    private Map<String, Object> error(HttpStatus status, String msg, HttpServletRequest req) {
        Map<String, Object> body = new java.util.LinkedHashMap<>();
        body.put("timestamp", OffsetDateTime.now().toString());
        body.put("estado", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("mensaje", msg);
        body.put("ruta", req.getRequestURI());
        return body;
    }
}
