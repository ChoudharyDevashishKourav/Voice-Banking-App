package com.healthcare.fhir.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/audio")
@CrossOrigin(origins = "http://localhost:3000")
public class AudioTranscribeController {

    @PostMapping(value = "/transcribe", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> transcribe(
            @RequestPart("file") MultipartFile file,
            @RequestParam(value = "speakerId", required = false) String speakerId
    ) throws Exception {

        // 1) Persist the upload to a temp file (keeps original extension if present)
        String original = file.getOriginalFilename();
        String suffix = (original != null && original.contains(".")) ? original.substring(original.lastIndexOf('.')) : ".webm";
        Path tempFile = Files.createTempFile("upload-", suffix);
        Files.write(tempFile, file.getBytes());

        // 2) Build the Whisper CLI command
        //    Example: whisper <audio_file> --model turbo --language English
        List<String> command = List.of(
                "whisper",
                tempFile.toAbsolutePath().toString(),
                "--model", "turbo",
                "--language", "English"
        );

        ProcessBuilder pb = new ProcessBuilder(command);
        // Optionally set working directory or PATH if whisper isn’t on PATH:
        // pb.directory(new File("/path/where/whisper/should/run"));
        pb.redirectErrorStream(true); // merge stderr into stdout so we can read a single stream

        // 3) Start process and capture output safely
        Process process = pb.start();
        StringBuilder output = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append('\n');
            }
        }
        int exit = process.waitFor();

        // 4) Clean up the temp file
        try {
            Files.deleteIfExists(tempFile);
        } catch (IOException ignore) { }

        // 5) Return result or error
        if (exit != 0) {
            // Whisper returned an error; return combined output so caller can debug

            return ResponseEntity.status(500).body(Map.of(
                    "error", "Whisper process failed",
                    "exitCode", exit,
                    "output", output.toString()
            ));
        }

        // Whisper CLI prints the transcription to stdout; return it as JSON
        String s = output.toString();
        String transcription = extractTranscription(s);
        System.out.println("-------------------------------THIS IS THE TRANSCRIPTION------------------");
        System.out.println(transcription);
        return ResponseEntity.ok(Map.of(
                "transcript", transcription,
                "speakerId", speakerId
        ));
    }

    private static final Pattern TRANSCRIPTION_PATTERN =
            Pattern.compile("^\\[\\d{2}:\\d{2}\\.\\d{3} --> \\d{2}:\\d{2}\\.\\d{3}\\]\\s*(.*)");

    public static String extractTranscription(String rawOutput) {
        if (rawOutput == null || rawOutput.isEmpty()) {
            return "";
        }

        StringBuilder transcription = new StringBuilder();
        String[] lines = rawOutput.split("\\r?\\n");

        for (String line : lines) {
            Matcher matcher = TRANSCRIPTION_PATTERN.matcher(line);
            if (matcher.find()) {
                transcription.append(matcher.group(1).trim()).append(" ");
            }
        }

        return transcription.toString().trim();
    }

}
