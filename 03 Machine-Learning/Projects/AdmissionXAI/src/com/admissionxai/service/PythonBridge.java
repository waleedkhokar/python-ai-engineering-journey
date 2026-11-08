package com.admissionxai.service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.File;

public class PythonBridge {

    public static String runPredictScript(String csvPath) {
        StringBuilder output = new StringBuilder();

        try {
            // Point directly to the virtual environment's python executable
            String pythonPath = "python/venv/Scripts/python.exe";
            
            // Check if relative venv exists, otherwise fallback to system python
            if (!new File(pythonPath).exists()) {
                pythonPath = "python";
            }

            ProcessBuilder pb = new ProcessBuilder(pythonPath, "python/predict.py", csvPath);
            pb.redirectErrorStream(false); 

            Process process = pb.start();

            // Read output
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append(line.trim());
                }
            }

            // Print errors to VS Code terminal if Python fails
            try (BufferedReader errReader = new BufferedReader(new InputStreamReader(process.getErrorStream()))) {
                String errLine;
                while ((errLine = errReader.readLine()) != null) {
                    System.err.println("[PYTHON ERROR] " + errLine);
                }
            }

            process.waitFor();
        } catch (Exception e) {
            e.printStackTrace();
        }

        String result = output.toString().trim();
        
        // Extract JSON array cleanly
        int jsonStart = result.indexOf("[");
        int jsonEnd = result.lastIndexOf("]");

        if (jsonStart != -1 && jsonEnd != -1 && jsonEnd > jsonStart) {
            return result.substring(jsonStart, jsonEnd + 1);
        }

        return result;
    }
}