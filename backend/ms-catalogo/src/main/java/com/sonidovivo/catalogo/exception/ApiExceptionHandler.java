package com.sonidovivo.catalogo.exception;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import java.util.*;
@RestControllerAdvice
public class ApiExceptionHandler {
 @ExceptionHandler(RecursoNoEncontradoException.class) public ResponseEntity<Map<String,String>> noEncontrado(RecursoNoEncontradoException e){return respuesta(HttpStatus.NOT_FOUND,e.getMessage());}
 @ExceptionHandler(ReglaNegocioException.class) public ResponseEntity<Map<String,String>> regla(ReglaNegocioException e){return respuesta(HttpStatus.CONFLICT,e.getMessage());}
 @ExceptionHandler(MethodArgumentNotValidException.class) public ResponseEntity<Map<String,String>> validar(MethodArgumentNotValidException e){String m=e.getBindingResult().getFieldErrors().stream().map(x->x.getField()+": "+x.getDefaultMessage()).findFirst().orElse("Solicitud inválida");return respuesta(HttpStatus.BAD_REQUEST,m);}
 @ExceptionHandler(DataIntegrityViolationException.class) public ResponseEntity<Map<String,String>> integridad(DataIntegrityViolationException e){return respuesta(HttpStatus.CONFLICT,"No se puede eliminar el recurso porque está relacionado o existe un dato duplicado");}
 private ResponseEntity<Map<String,String>> respuesta(HttpStatus s,String m){return ResponseEntity.status(s).body(Map.of("estado","error","mensaje",m));}
}
