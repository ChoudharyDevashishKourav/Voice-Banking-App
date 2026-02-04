





// HealthController.java
package com.healthcare.fhir.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/health")
@CrossOrigin(origins = "*", maxAge = 3600)
public class HealthController {

    @Value("${namaste.version}")
    private String namasteVersion;

    @Value("${namaste.system-uri}")
    private String namasteSystemUri;



    @GetMapping("/about")
    public ResponseEntity<Map<String, Object>> about() {
        Map<String, Object> about = new HashMap<>();
        about.put("service", "FHIR Terminology Service");
        about.put("version", "1.0.0");
        about.put("namaste", Map.of(
            "version", namasteVersion,
            "systemUri", namasteSystemUri
        ));
        about.put("timestamp", System.currentTimeMillis());
        
        return ResponseEntity.ok(about);
    }

    @GetMapping("/ready")
    public ResponseEntity<Map<String, String>> ready() {
        return ResponseEntity.ok(Map.of("status", "ready"));
    }


    @GetMapping("/live")
    public ResponseEntity<Map<String, String>> live() {
        return ResponseEntity.ok(Map.of("status", "live"));
    }
}