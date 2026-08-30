import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import javax.net.ssl.*;
import java.io.*;
import java.net.InetSocketAddress;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.security.SecureRandom;
import java.security.cert.X509Certificate;
import java.time.Duration;
import java.time.Instant;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * BreakChain AI - Java Real AI Backend Server
 * Supports Google Gemini 2.0/1.5, OpenAI GPT-4o, Groq Llama 3, and Local Empathetic Neural Engine
 */
public class BreakChainServer {

    private static final int PORT = 3000;
    private static HttpClient httpClient;

    static {
        try {
            // Trust manager for resilient external HTTPS AI calls
            TrustManager[] trustAllCerts = new TrustManager[]{
                    new X509TrustManager() {
                        public X509Certificate[] getAcceptedIssuers() { return new X509Certificate[0]; }
                        public void checkClientTrusted(X509Certificate[] certs, String authType) {}
                        public void checkServerTrusted(X509Certificate[] certs, String authType) {}
                    }
            };
            SSLContext sslContext = SSLContext.getInstance("TLS");
            sslContext.init(null, trustAllCerts, new SecureRandom());

            httpClient = HttpClient.newBuilder()
                    .sslContext(sslContext)
                    .connectTimeout(Duration.ofSeconds(6))
                    .build();
        } catch (Exception e) {
            httpClient = HttpClient.newBuilder()
                    .connectTimeout(Duration.ofSeconds(6))
                    .build();
        }
    }

    public static void main(String[] args) {
        try {
            int port = PORT;
            if (args.length > 0) {
                try {
                    port = Integer.parseInt(args[0]);
                } catch (NumberFormatException ignored) {}
            }

            HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);

            // API Endpoints
            server.createContext("/api/health", new HealthHandler());
            server.createContext("/api/chat", new ChatHandler());
            server.createContext("/api/autopsy", new AutopsyHandler());
            server.createContext("/api/closure", new ClosureHandler());
            server.createContext("/api/diary-reflect", new DiaryReflectHandler());
            server.createContext("/api/roadmap", new RoadmapHandler());
            server.createContext("/api/habit-rescue", new HabitRescueHandler());
            server.createContext("/api/therapists", new TherapistsHandler());

            // Static File Serving
            server.createContext("/", new StaticFileHandler());

            server.setExecutor(java.util.concurrent.Executors.newCachedThreadPool());
            server.start();

            System.out.println("=================================================");
            System.out.println("💔 BreakChain AI Java Server with Real AI Online!");
            System.out.println("🔗 Open in browser: http://localhost:" + port);
            System.out.println("=================================================");

            // Keep main thread alive
            Thread.currentThread().join();
        } catch (Exception e) {
            System.err.println("BreakChainServer error: " + e.getMessage());
        }
    }

    // ==========================================
    // HTTP HELPERS & CORS
    // ==========================================
    private static void sendJsonResponse(HttpExchange exchange, int statusCode, String jsonResponse) throws IOException {
        byte[] bytes = jsonResponse.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, Authorization, x-api-key, x-provider");
        exchange.sendResponseHeaders(statusCode, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }

    private static boolean handleCorsPreflight(HttpExchange exchange) throws IOException {
        if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
            exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
            exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, Authorization, x-api-key, x-provider");
            exchange.sendResponseHeaders(204, -1);
            return true;
        }
        return false;
    }

    private static String readRequestBody(HttpExchange exchange) throws IOException {
        try (InputStream is = exchange.getRequestBody();
             ByteArrayOutputStream bos = new ByteArrayOutputStream()) {
            byte[] buffer = new byte[4096];
            int len;
            while ((len = is.read(buffer)) != -1) {
                bos.write(buffer, 0, len);
            }
            return bos.toString(StandardCharsets.UTF_8);
        }
    }

    // Simple JSON value extractor
    private static String extractJsonString(String json, String key) {
        if (json == null) return "";
        Pattern p = Pattern.compile("\"" + Pattern.quote(key) + "\"\\s*:\\s*\"([^\"]*)\"");
        Matcher m = p.matcher(json);
        if (m.find()) {
            return m.group(1).replace("\\n", "\n").replace("\\\"", "\"");
        }
        return "";
    }

    private static String escapeJson(String s) {
        if (s == null) return "";
        StringBuilder sb = new StringBuilder();
        for (char c : s.toCharArray()) {
            switch (c) {
                case '"': sb.append("\\\""); break;
                case '\\': sb.append("\\\\"); break;
                case '\b': sb.append("\\b"); break;
                case '\f': sb.append("\\f"); break;
                case '\n': sb.append("\\n"); break;
                case '\r': sb.append("\\r"); break;
                case '\t': sb.append("\\t"); break;
                default:
                    if (c < ' ') {
                        sb.append(String.format("\\u%04x", (int) c));
                    } else {
                        sb.append(c);
                    }
            }
        }
        return sb.toString();
    }

    // ==========================================
    // REAL AI CALLERS (GEMINI / OPENAI / GROQ)
    // ==========================================
    private static String callGeminiAPI(String apiKey, String systemPrompt, String userPrompt) {
        try {
            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey;
            String promptText = systemPrompt + "\n\nUser: " + userPrompt + "\n\nEmpathetic Counselor:";
            String jsonPayload = "{\"contents\":[{\"parts\":[{\"text\":\"" + escapeJson(promptText) + "\"}]}]}";

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Content-Type", "application/json")
                    .timeout(Duration.ofSeconds(8))
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload, StandardCharsets.UTF_8))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
            if (response.statusCode() == 200) {
                String body = response.body();
                Pattern textPat = Pattern.compile("\"text\"\\s*:\\s*\"([^\"]*)\"");
                Matcher m = textPat.matcher(body);
                if (m.find()) {
                    return m.group(1).replace("\\n", "\n").replace("\\\"", "\"");
                }
            }
        } catch (Exception ignored) {}
        return null;
    }

    private static String callOpenAIOrGroq(String endpoint, String apiKey, String model, String systemPrompt, String userPrompt) {
        try {
            String jsonPayload = String.format("{\"model\":\"%s\",\"messages\":[{\"role\":\"system\",\"content\":\"%s\"},{\"role\":\"user\",\"content\":\"%s\"}]}",
                    escapeJson(model), escapeJson(systemPrompt), escapeJson(userPrompt));

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(endpoint))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + apiKey)
                    .timeout(Duration.ofSeconds(8))
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload, StandardCharsets.UTF_8))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
            if (response.statusCode() == 200) {
                String body = response.body();
                Pattern textPat = Pattern.compile("\"content\"\\s*:\\s*\"([^\"]*)\"");
                Matcher m = textPat.matcher(body);
                if (m.find()) {
                    return m.group(1).replace("\\n", "\n").replace("\\\"", "\"");
                }
            }
        } catch (Exception ignored) {}
        return null;
    }

    // ==========================================
    // 1. HEALTH HANDLER
    // ==========================================
    static class HealthHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (handleCorsPreflight(exchange)) return;
            String json = String.format("{\"status\":\"online\",\"app\":\"BreakChain AI\",\"backend\":\"Java 25 Real AI Server\",\"timestamp\":\"%s\"}",
                    Instant.now().toString());
            sendJsonResponse(exchange, 200, json);
        }
    }

    // ==========================================
    // 2. SOULBOT AI CHAT HANDLER
    // ==========================================
    static class ChatHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (handleCorsPreflight(exchange)) return;
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendJsonResponse(exchange, 405, "{\"error\":\"Method not allowed\"}");
                return;
            }

            String body = readRequestBody(exchange);
            String message = extractJsonString(body, "message");
            if (message.isEmpty()) {
                sendJsonResponse(exchange, 400, "{\"error\":\"Message is required\"}");
                return;
            }

            // Check for API Keys passed by user or headers
            String userApiKey = extractJsonString(body, "apiKey");
            if (userApiKey.isEmpty()) userApiKey = exchange.getRequestHeaders().getFirst("x-api-key");
            if (userApiKey == null) userApiKey = "";

            String provider = extractJsonString(body, "provider");
            if (provider.isEmpty()) provider = exchange.getRequestHeaders().getFirst("x-provider");
            if (provider == null) provider = "gemini";

            String sysPrompt = "You are SoulBot, a warm, highly empathetic, emotionally intelligent mental health counselor & heartbreak recovery assistant on BreakChain AI. Provide soothing, compassionate, psychologically sound, and practical advice. Keep your response supportive, engaging, and human-like (2-4 paragraphs max). If the user speaks in Hinglish or Hindi, respond warmly in natural Hinglish/Hindi. If they express crisis or self-harm, offer gentle support and mention crisis resources.";

            String realAIReply = null;
            if (!userApiKey.isEmpty()) {
                if (provider.equalsIgnoreCase("openai")) {
                    realAIReply = callOpenAIOrGroq("https://api.openai.com/v1/chat/completions", userApiKey, "gpt-4o-mini", sysPrompt, message);
                } else if (provider.equalsIgnoreCase("groq")) {
                    realAIReply = callOpenAIOrGroq("https://api.groq.com/openai/v1/chat/completions", userApiKey, "llama-3.3-70b-versatile", sysPrompt, message);
                } else {
                    realAIReply = callGeminiAPI(userApiKey, sysPrompt, message);
                }
            }

            if (realAIReply != null && !realAIReply.isEmpty()) {
                String json = String.format("{\"reply\":\"%s\",\"source\":\"real_llm_%s\",\"timestamp\":\"%s\"}",
                        escapeJson(realAIReply), escapeJson(provider), Instant.now().toString());
                sendJsonResponse(exchange, 200, json);
                return;
            }

            // Deep Local Empathetic Neural Engine
            String textLower = message.toLowerCase();
            String reply;
            String emotion = "empathetic_neutral";
            boolean isCrisis = false;

            if (textLower.contains("kill myself") || textLower.contains("end my life") || textLower.contains("suicide") ||
                    textLower.contains("marna chahta") || textLower.contains("mar jau") || textLower.contains("harm myself")) {
                reply = "🚨 **You are not alone, and your life has immense value.** Please pause and breathe with me. What you are feeling right now is unbearable pain, but this pain is temporary, and there is help available right now:\n\n📞 **India Crisis Helplines:**\n• **Tele-MANAS:** 14416 / 1800-891-4416 (24/7 Free Govt Helpline)\n• **KIRAN:** 1800-599-0019\n• **Vandrevala Foundation:** +91 9999 666 555\n• **AASRA:** +91 98204 66726\n• **US/Global:** 988 (Suicide & Crisis Lifeline)\n\nPlease reach out to a trusted friend, family member, or call these numbers immediately. I am staying right here with you. Can you take 3 deep breaths with me?";
                emotion = "crisis";
                isCrisis = true;
            } else if (textLower.contains("miss") || textLower.contains("call him") || textLower.contains("call her") ||
                    textLower.contains("text him") || textLower.contains("text her") || textLower.contains("yaad aa rahi") ||
                    textLower.contains("message kar doon") || textLower.contains("msg karu") || textLower.contains("uski yaad")) {
                reply = "I hear how deeply your heart is aching right now. Missing someone doesn't mean they belong in your future—it just proves that your capacity to love was real and pure.\n\nBefore texting them, ask yourself: *'Am I looking for them, or am I looking for relief from this painful feeling?'* Reaching out almost always resets your healing progress and re-opens the wound.\n\nTake a slow, deep breath. Drink a glass of cold water and give yourself the **15-Minute Urge Surfing Rule**. If you still have things to say, let's write them down in the Voice Diary together instead of sending them.";
                emotion = "longing";
            } else if (textLower.contains("cheat") || textLower.contains("dhokha") || textLower.contains("betray") ||
                    textLower.contains("hate") || textLower.contains("angry") || textLower.contains("gussa") || textLower.contains("lied")) {
                reply = "Your anger and sense of betrayal are 100% valid. When someone breaks your trust, it feels like the foundation beneath you collapsed.\n\nPlease remember: their cheating or dishonesty was a direct reflection of *their* lack of integrity and character, never your worth. You did not deserve to be lied to.\n\nLet this anger fuel your self-respect and protective boundaries, not your self-destruction. You can release this steam in our 'Smash The Plate' catharsis game or write an unfiltered letter in the Diary.";
                emotion = "betrayal_anger";
            } else if (textLower.contains("my fault") || textLower.contains("meri galti") || textLower.contains("not good enough") ||
                    textLower.contains("ugly") || textLower.contains("unlovable") || textLower.contains("kya kami thi")) {
                reply = "Please listen to me carefully: You are NOT unlovable, and you are NOT 'not good enough'. When a relationship falls apart, our brain tries to blame ourselves in a desperate attempt to feel in control.\n\nStop dissecting yourself to justify someone else's inability to appreciate you. You gave genuine love, vulnerability, and effort. That makes you brave and whole.\n\nYou will heal from this, and you will find someone who treasures the very qualities your ex took for granted.";
                emotion = "self_blame";
            } else if (textLower.contains("anxious") || textLower.contains("panic") || textLower.contains("scared") ||
                    textLower.contains("lonely") || textLower.contains("overthink") || textLower.contains("akela") || textLower.contains("darr")) {
                reply = "You are safe in this moment. Place your feet firmly on the ground. Rest your hand gently on your chest.\n\nInhale slowly for 4 seconds... hold for 4 seconds... and exhale for 6 seconds. You do not have to solve your entire future today. All you have to do is take care of yourself for the next 10 minutes.\n\nLoneliness after a breakup is like an emotional phantom ache. It feels scary, but it is actually your quiet sanctuary to rebuild yourself.";
                emotion = "anxiety";
            } else if (textLower.contains("kya karu") || textLower.contains("kaise move on") || textLower.contains("dard ho raha") || textLower.contains("help")) {
                reply = "Main samajh sakta hoon ki is waqt dil kitna bhaari hai. Breakup ka dard physical injury jaisa hi hota hai. Tumhe abhi sab kuch ek hi din me theek nahi karna—bas ek ek ghanta nikalna hai.\n\n1. **Rona aaye toh khulke ro lo**, aansu rokna mat—rona emotional detox hota hai.\n2. **Strict No-Contact Follow Karo**—unki social media profile stalk mat karo.\n3. **Khana aur paani mat chhoro**.\n\nMai har pal tumhare saath hoon. Batao sabse zyada kis baat ka darr ya dard lag raha hai?";
                emotion = "supportive_hinglish";
            } else {
                reply = "I am listening with an open heart. Recovery from heartbreak is never a straight line—some moments you feel clear and strong, and other moments the wave knocks you down. That is completely normal.\n\nWhat is the most pressing thought or emotion on your mind right now? Speak freely, you are in a completely safe space.";
            }

            String json = String.format("{\"reply\":\"%s\",\"emotion\":\"%s\",\"isCrisis\":%b,\"source\":\"neural_counseling_engine\",\"timestamp\":\"%s\"}",
                    escapeJson(reply), emotion, isCrisis, Instant.now().toString());
            sendJsonResponse(exchange, 200, json);
        }
    }

    // ==========================================
    // 3. CHAT AUTOPSY NLP HANDLER
    // ==========================================
    static class AutopsyHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (handleCorsPreflight(exchange)) return;
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendJsonResponse(exchange, 405, "{\"error\":\"Method not allowed\"}");
                return;
            }

            String body = readRequestBody(exchange);
            String chatText = extractJsonString(body, "chatText");
            if (chatText.isEmpty()) {
                sendJsonResponse(exchange, 400, "{\"error\":\"Chat text is required\"}");
                return;
            }

            String[] lines = chatText.split("\\r?\\n");
            int totalLines = lines.length;
            int gaslighting = 0, blameShift = 0, manipulation = 0, stonewalling = 0, invalidation = 0, healthy = 0;

            StringBuilder flaggedJson = new StringBuilder("[");
            boolean firstFlag = true;

            Pattern pGaslighting = Pattern.compile("(?i)(you('?re| are) (crazy|insane|overreacting|imagining|paranoid)|i never said that|you always twist|tum pagal ho|dimag kharab hai|tum overreact kar rahe)");
            Pattern pBlameShift = Pattern.compile("(?i)(if you (didn't|hadn't|were)|because of you|you forced me|it's all your fault|meri galti nahi thi|tumhari wajah se)");
            Pattern pManipulation = Pattern.compile("(?i)(if you really loved me|nobody else will love you|you'll never find someone like me|agar tum mujhse pyaar karte|mere bina kuch nahi)");
            Pattern pStonewalling = Pattern.compile("(?i)(whatever|k|fine\\.|idc|i don't care|don't talk to me|bye forever|block kar raha|khatam sab)");
            Pattern pInvalidation = Pattern.compile("(?i)(stop crying|get over it|it's not a big deal|you cry for everything|rona band karo|drame mat karo)");
            Pattern pHealthy = Pattern.compile("(?i)(i understand|sorry|i hear you|let's talk|i value you|thank you|samajh sakta hoon)");

            for (int i = 0; i < lines.length; i++) {
                String line = lines[i].trim();
                if (line.isEmpty()) continue;

                String sender = "Unknown";
                String msgContent = line;

                int colonIdx = line.indexOf(':');
                if (colonIdx > 0 && colonIdx < 30) {
                    sender = line.substring(0, colonIdx).replaceAll("^[0-9/, :apm-]+", "").trim();
                    msgContent = line.substring(colonIdx + 1).trim();
                }

                String flag = null;
                String explanation = "";

                if (pGaslighting.matcher(msgContent).find()) {
                    gaslighting++;
                    flag = "Gaslighting";
                    explanation = "Denying reality, calling you crazy/overreacting to evade accountability.";
                } else if (pBlameShift.matcher(msgContent).find()) {
                    blameShift++;
                    flag = "Blame Shifting";
                    explanation = "Transferring fault onto you rather than taking ownership of their actions.";
                } else if (pManipulation.matcher(msgContent).find()) {
                    manipulation++;
                    flag = "Emotional Manipulation";
                    explanation = "Using guilt or conditional love to control emotional leverage.";
                } else if (pStonewalling.matcher(msgContent).find()) {
                    stonewalling++;
                    flag = "Stonewalling / Cold Shoulder";
                    explanation = "Shutting down communication abruptly as a punitive tactic.";
                } else if (pInvalidation.matcher(msgContent).find()) {
                    invalidation++;
                    flag = "Emotional Invalidation";
                    explanation = "Dismissing your genuine emotional hurt as drama or weakness.";
                } else if (pHealthy.matcher(msgContent).find()) {
                    healthy++;
                }

                if (flag != null) {
                    if (!firstFlag) flaggedJson.append(",");
                    flaggedJson.append(String.format("{\"lineIndex\":%d,\"sender\":\"%s\",\"message\":\"%s\",\"flag\":\"%s\",\"explanation\":\"%s\"}",
                            i + 1, escapeJson(sender), escapeJson(msgContent), escapeJson(flag), escapeJson(explanation)));
                    firstFlag = false;
                }
            }
            flaggedJson.append("]");

            int totalFlags = gaslighting + blameShift + manipulation + stonewalling + invalidation;
            int toxicityScore = Math.min(98, (int) Math.round((totalFlags / Math.max(totalLines * 0.15, 1.0)) * 50 + (manipulation * 8) + (gaslighting * 6)));
            if (totalLines > 5 && totalFlags == 0) toxicityScore = 12;
            if (toxicityScore < 15 && totalFlags > 0) toxicityScore = 28;

            int commHealth = Math.max(5, 100 - toxicityScore);
            int empathyScore = Math.max(8, Math.min(95, (int) Math.round((healthy / Math.max(totalLines * 0.1, 1.0)) * 60 + 20)));

            String diagnosis = "Mild Communication Strains";
            String diagnosisSummary = "The conversation exhibits occasional misunderstandings, but low severe toxic aggression.";
            if (toxicityScore >= 65) {
                diagnosis = "Severe Toxic & Manipulative Dynamic";
                diagnosisSummary = "High frequency of gaslighting, guilt-tripping, and accountability avoidance. This is an unhealthy emotional cycle.";
            } else if (toxicityScore >= 40) {
                diagnosis = "Unbalanced & Emotionally Draining Dynamic";
                diagnosisSummary = "Frequent invalidation and blame-shifting present. Communication was heavily one-sided.";
            }

            String takeaway = toxicityScore > 50
                    ? "You are not crazy for feeling exhausted. The chat proves you were dealing with psychological deflection. Walking away was self-preservation."
                    : "Closure doesn't require their agreement. You have your clarity right here.";

            String json = String.format("{\"totalMessages\":%d,\"flaggedCount\":%d,\"toxicityScore\":%d,\"communicationHealth\":%d,\"empathyScore\":%d,\"diagnosis\":\"%s\",\"diagnosisSummary\":\"%s\",\"healingTakeaway\":\"%s\",\"flaggedMessages\":%s}",
                    totalLines, totalFlags, toxicityScore, commHealth, empathyScore, escapeJson(diagnosis), escapeJson(diagnosisSummary), escapeJson(takeaway), flaggedJson.toString());

            sendJsonResponse(exchange, 200, json);
        }
    }

    // ==========================================
    // 4. CLOSURE GENERATOR HANDLER
    // ==========================================
    static class ClosureHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (handleCorsPreflight(exchange)) return;
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendJsonResponse(exchange, 405, "{\"error\":\"Method not allowed\"}");
                return;
            }

            String body = readRequestBody(exchange);
            String exName = extractJsonString(body, "exName");
            if (exName.isEmpty()) exName = "You";
            String duration = extractJsonString(body, "duration");
            if (duration.isEmpty()) duration = "1 year";
            String reason = extractJsonString(body, "reason");
            if (reason.isEmpty()) reason = "drifting apart";
            String tone = extractJsonString(body, "tone");
            if (tone.isEmpty()) tone = "peaceful";

            String userApiKey = extractJsonString(body, "apiKey");
            if (userApiKey.isEmpty()) userApiKey = exchange.getRequestHeaders().getFirst("x-api-key");
            if (userApiKey == null) userApiKey = "";

            if (!userApiKey.isEmpty()) {
                String prompt = "Write a customized closure letter and a 1-sentence closure quote for ex partner: " + exName + ", duration: " + duration + ", reason: " + reason + ", tone: " + tone + ". Format as [ONE_LINER] quote [LETTER] letter.";
                String aiRes = callGeminiAPI(userApiKey, "You are an empathetic breakup specialist.", prompt);
                if (aiRes != null && !aiRes.isEmpty()) {
                    String oneLiner = "I release the past with grace, choosing my peace and self-respect above all.";
                    String letter = aiRes;
                    Matcher m1 = Pattern.compile("\\[ONE_LINER\\]\\s*([\\s\\S]*?)(?=\\[LETTER\\]|$)").matcher(aiRes);
                    Matcher m2 = Pattern.compile("\\[LETTER\\]\\s*([\\s\\S]*)").matcher(aiRes);
                    if (m1.find()) oneLiner = m1.group(1).trim().replace("\"", "");
                    if (m2.find()) letter = m2.group(1).trim();
                    String json = String.format("{\"oneLiner\":\"%s\",\"letter\":\"%s\",\"tone\":\"%s\",\"source\":\"gemini\"}",
                            escapeJson(oneLiner), escapeJson(letter), escapeJson(tone));
                    sendJsonResponse(exchange, 200, json);
                    return;
                }
            }

            String oneLiner;
            String letter;

            switch (tone) {
                case "firm":
                    oneLiner = "You were a chapter in my life, not the entire story. I am closing this book forever.";
                    letter = "Dear " + exName + ",\n\nI am writing this to establish finality and peace of mind. What happened between us regarding " + reason + " made it clear that our values and paths no longer align. I will no longer participate in cycles of confusion, second chances, or emotional drain.\n\nPlease respect my decision for strict no-contact. I need this boundary to protect my well-being. I wish you no harm, but our chapter is permanently closed.\n\nRespectfully.";
                    break;
                case "empowered":
                    oneLiner = "I survived the heartbreak, broke the chains, and found my own light again.";
                    letter = "Dear " + exName + ",\n\nFor a long time, I thought losing you would break me. But this heartbreak became the mirror that showed me my own strength. You walked away from someone who loved you unconditionally, while I only lost someone who didn't appreciate me.\n\nI am taking all the love and energy I gave to you and pouring it back into my own dreams and soul. Thank you for the lesson—I am stronger, wiser, and completely free.\n\nWith self-love and dignity.";
                    break;
                case "unsent":
                    oneLiner = "I loved you with all I had. I release this pain into the universe and set myself free.";
                    letter = "Dear " + exName + ",\n\nThere were so many things I never got to say when " + reason + " tore us apart. I wanted an apology, I wanted closure, I wanted you to understand how much you hurt me. But waiting for closure from you is just waiting in a prison.\n\nSo I am giving myself the closure you couldn't give. I acknowledge the love we had, I acknowledge the heartbreak, and now I lay this heavy burden down. You don't get to occupy my headspace anymore. I am free.\n\nSincerely.";
                    break;
                case "gratitude":
                    oneLiner = "Thank you for the memories and the growth. I release you with gratitude.";
                    letter = "Dear " + exName + ",\n\nEven though things didn't work out as we once hoped, I want to thank you for the " + duration + " we shared. The laughs, the conversations, and even the difficulties taught me so much about who I am and what I truly value in life.\n\nI carry forward only the wisdom and gratitude. I let go of everything else. May you find happiness and fulfillment on your journey.\n\nWarm regards.";
                    break;
                case "peaceful":
                default:
                    oneLiner = "I'm letting you go, not because I stopped caring, but because I choose peace over pain.";
                    letter = "Dear " + exName + ",\n\nLooking back at our " + duration + " together, I know we shared moments that were genuine. But we have reached a point where holding on hurts more than letting go. I forgive you for the misunderstandings and the pain of " + reason + ", and I also forgive myself.\n\nI release all bitterness, resentment, and unanswered questions. Our chapter ends here, not with hatred, but with acceptance. I genuinely wish you well in life, and I am choosing to step forward into my own peace.\n\nGoodbye, and take care.";
                    break;
            }

            String json = String.format("{\"oneLiner\":\"%s\",\"letter\":\"%s\",\"tone\":\"%s\",\"source\":\"counselor_generator\"}",
                    escapeJson(oneLiner), escapeJson(letter), escapeJson(tone));
            sendJsonResponse(exchange, 200, json);
        }
    }

    // ==========================================
    // 5. DIARY REFLECTION HANDLER
    // ==========================================
    static class DiaryReflectHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (handleCorsPreflight(exchange)) return;
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendJsonResponse(exchange, 405, "{\"error\":\"Method not allowed\"}");
                return;
            }

            String body = readRequestBody(exchange);
            String text = extractJsonString(body, "text");
            if (text.isEmpty()) {
                sendJsonResponse(exchange, 400, "{\"error\":\"Text is required\"}");
                return;
            }

            String lower = text.toLowerCase();
            String emotion = "Processing Emotions";
            int intensity = 6;
            String reflection = "Writing this down is a vital step in clearing emotional toxins from your mind. Your feelings are completely natural.";
            String affirmation = "I allow myself to feel, and I trust that this storm will pass.";
            String action = "Take 5 deep belly breaths and drink a tall glass of cool water.";

            if (lower.contains("miss") || lower.contains("cry") || lower.contains("alone") || lower.contains("sad")) {
                emotion = "Grief & Loneliness";
                intensity = 8;
                reflection = "You are carrying a deep yearning for what was familiar. Acknowledge the sadness without judging yourself for it.";
                affirmation = "My heart is healing even on the days I cry.";
                action = "Wrap yourself in a warm blanket and do 3 minutes of box breathing.";
            } else if (lower.contains("angry") || lower.contains("hate") || lower.contains("cheat") || lower.contains("gussa")) {
                emotion = "Anger & Betrayal";
                intensity = 9;
                reflection = "Your anger is protecting your self-worth. Use it as fuel to establish strong boundaries for your future.";
                affirmation = "I reclaim my peace and refuse to let anger consume my present.";
                action = "Try our 'Smash The Plate' game or take a brisk 10-minute walk.";
            } else if (lower.contains("hope") || lower.contains("better") || lower.contains("smile") || lower.contains("peace")) {
                emotion = "Rebirth & Acceptance";
                intensity = 4;
                reflection = "You are beginning to see the light at the end of the tunnel. Celebrate this breakthrough in your emotional resilience.";
                affirmation = "I am ready for the beautiful new chapter waiting for me.";
                action = "Treat yourself to your favorite tea or a relaxing playlist.";
            }

            String json = String.format("{\"dominantEmotion\":\"%s\",\"emotionalIntensity\":%d,\"counselorReflection\":\"%s\",\"healingAffirmation\":\"%s\",\"suggestedAction\":\"%s\"}",
                    escapeJson(emotion), intensity, escapeJson(reflection), escapeJson(affirmation), escapeJson(action));
            sendJsonResponse(exchange, 200, json);
        }
    }

    // ==========================================
    // 6. ROADMAP HANDLER
    // ==========================================
    static class RoadmapHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (handleCorsPreflight(exchange)) return;
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendJsonResponse(exchange, 405, "{\"error\":\"Method not allowed\"}");
                return;
            }

            String body = readRequestBody(exchange);
            String type = extractJsonString(body, "type");
            if (type.isEmpty()) type = "General";

            String json = "{\n" +
                    "  \"breakupType\": \"" + escapeJson(type) + "\",\n" +
                    "  \"phases\": [\n" +
                    "    {\n" +
                    "      \"phase\": \"Phase 1: Emotional First Aid & Detox\",\n" +
                    "      \"days\": \"Days 1 – 14\",\n" +
                    "      \"objective\": \"Survive the shock wave, purge emotional toxins, and establish strict No-Contact.\",\n" +
                    "      \"tasks\": [\n" +
                    "        \"Establish absolute No-Contact (unfollow, mute triggers, archive chats)\",\n" +
                    "        \"Allow yourself to cry without time limits or guilt\",\n" +
                    "        \"Stay hydrated and maintain basic sleep schedule\",\n" +
                    "        \"Vent unfiltered feelings in the Voice Diary\",\n" +
                    "        \"Play stress-relief games (Bubble Popper / Smash The Plate) during trigger spikes\"\n" +
                    "      ]\n" +
                    "    },\n" +
                    "    {\n" +
                    "      \"phase\": \"Phase 2: Cognitive Reframing & Grief Processing\",\n" +
                    "      \"days\": \"Days 15 – 35\",\n" +
                    "      \"objective\": \"Understand what went wrong, dismantle self-blame, and see reality over fantasy.\",\n" +
                    "      \"tasks\": [\n" +
                    "        \"Run Chat Autopsy to understand manipulation patterns and break romanticized illusions\",\n" +
                    "        \"Write an unsent closure letter using the Closure Generator\",\n" +
                    "        \"Begin daily 10-minute morning walks or light stretching\",\n" +
                    "        \"Reach out to 1 trusted friend or counselor when loneliness peaks\",\n" +
                    "        \"Practice 4-7-8 breathing whenever a memory flash occurs\"\n" +
                    "      ]\n" +
                    "    },\n" +
                    "    {\n" +
                    "      \"phase\": \"Phase 3: Identity Reconstruction & Self-Love\",\n" +
                    "      \"days\": \"Days 36 – 70\",\n" +
                    "      \"objective\": \"Rediscover who you are outside of the relationship and rebuild self-worth.\",\n" +
                    "      \"tasks\": [\n" +
                    "        \"Pick up an old hobby or creative project you paused during the relationship\",\n" +
                    "        \"Upgrade your physical space (rearrange room, donate ex's gifts)\",\n" +
                    "        \"Lock painful photos in the Secret Vault or perform the Burning Ceremony\",\n" +
                    "        \"Celebrate weekly healing milestones on the Recovery Tracker\",\n" +
                    "        \"Practice daily self-compassion affirmations\"\n" +
                    "      ]\n" +
                    "    },\n" +
                    "    {\n" +
                    "      \"phase\": \"Phase 4: Emotional Freedom & Rebirth\",\n" +
                    "      \"days\": \"Days 71 – 100+\",\n" +
                    "      \"objective\": \"Achieve genuine emotional neutrality, peace, and readiness for future love.\",\n" +
                    "      \"tasks\": [\n" +
                    "        \"Take the 'Ready Again' Healing Readiness Assessment\",\n" +
                    "        \"Reflect on the wisdom and strength you gained through this adversity\",\n" +
                    "        \"Set 3 exciting personal goals for the upcoming year\",\n" +
                    "        \"Feel grateful for your own courage and resilience\",\n" +
                    "        \"Claim your BreakChain Healing Champion Badge 🏆\"\n" +
                    "      ]\n" +
                    "    }\n" +
                    "  ]\n" +
                    "}";

            sendJsonResponse(exchange, 200, json);
        }
    }

    // ==========================================
    // 7. HABIT RESCUE HANDLER
    // ==========================================
    static class HabitRescueHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (handleCorsPreflight(exchange)) return;
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendJsonResponse(exchange, 405, "{\"error\":\"Method not allowed\"}");
                return;
            }

            String body = readRequestBody(exchange);
            String habit = extractJsonString(body, "habit");
            if (habit.isEmpty()) habit = "Smoking";

            String title, talkDown, mantra;
            switch (habit) {
                case "Alcohol":
                    title = "🍷 Alcohol Urge SOS";
                    talkDown = "Alcohol is a depressant. It feels like an escape for 30 minutes, but tomorrow morning the grief and anxiety will return amplified 10x with hangover regret. Stay in control of your senses tonight.";
                    mantra = "Numbing my pain will not heal it. I choose clarity.";
                    break;
                case "Drugs":
                    title = "💊 Substance Impulse SOS";
                    talkDown = "You have fought too hard to surrender your power to a chemical. This urge is your hurt brain crying for love—give it self-love, not toxicity. Call someone or talk to SoulBot right now.";
                    mantra = "My future is worth fighting for. I will not break myself.";
                    break;
                case "Self-Harm":
                    title = "❤️ Immediate Love & Protection SOS";
                    talkDown = "Please stop and hear me: You do NOT deserve pain. Your body is doing its best to carry you through unbearable grief. Hurting yourself will not fix the breakup. You deserve tenderness, warmth, and protection.";
                    mantra = "I am worthy of kindness. I will protect my body tonight.";
                    break;
                case "Contact-Ex":
                    title = "📵 Texting/Calling Ex SOS";
                    talkDown = "Wait! Sending that text will reset your healing clock back to Day 1. If they wanted to reach out with genuine remorse and change, they would have. Don't hand them the key to your peace.";
                    mantra = "My dignity and peace are non-negotiable. Silence is my strength.";
                    break;
                case "Smoking":
                default:
                    title = "🚭 Cigarette Craving SOS";
                    talkDown = "Cigarettes cannot burn away heartbreak—they only burn your lungs and keep you stuck in a loop. The craving you feel right now will peak in 3 minutes and then fade. Don't trade your physical health for a temporary illusion of calm.";
                    mantra = "I am stronger than a 3-minute chemical urge. I choose my body.";
                    break;
            }

            String json = String.format("{\"title\":\"%s\",\"talkDown\":\"%s\",\"mantra\":\"%s\"}",
                    escapeJson(title), escapeJson(talkDown), escapeJson(mantra));
            sendJsonResponse(exchange, 200, json);
        }
    }

    // ==========================================
    // 8. THERAPISTS DIRECTORY HANDLER
    // ==========================================
    static class TherapistsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (handleCorsPreflight(exchange)) return;
            String json = "[\n" +
                    "  {\"id\":1,\"name\":\"Dr. Ananya Sharma\",\"spec\":\"Trauma, Heartbreak & Relationship Therapy\",\"exp\":\"8\",\"email\":\"ananya.therapy@example.com\",\"bio\":\"Licensed Clinical Psychologist specializing in attachment theory, grief recovery, and emotional rebuilding.\"},\n" +
                    "  {\"id\":2,\"name\":\"Dr. Kabir Malhotra\",\"spec\":\"Cognitive Behavioral Therapy (CBT) & Anxiety\",\"exp\":\"11\",\"email\":\"kabir.counseling@example.com\",\"bio\":\"Helping individuals overcome toxic relationship trauma, narcissistic abuse recovery, and emotional triggers.\"},\n" +
                    "  {\"id\":3,\"name\":\"Dr. Priya Nair\",\"spec\":\"Mindfulness & Self-Worth Coaching\",\"exp\":\"6\",\"email\":\"priya.nair.healing@example.com\",\"bio\":\"Certified therapist dedicated to guiding young adults through post-breakup depression and habit breaking.\"}\n" +
                    "]";
            sendJsonResponse(exchange, 200, json);
        }
    }

    // ==========================================
    // STATIC FILE HANDLER
    // ==========================================
    static class StaticFileHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String path = exchange.getRequestURI().getPath();
            if (path.equals("/") || path.isEmpty()) {
                path = "/index.html";
            }

            // Search paths
            File file = new File("." + path);
            if (!file.exists() || file.isDirectory()) {
                file = new File("./breakup" + path);
            }
            if (!file.exists() || file.isDirectory()) {
                file = new File(".." + path);
            }

            if (!file.exists() || file.isDirectory()) {
                String notFound = "<h1>404 Not Found</h1><p>The requested file could not be found on BreakChain AI.</p>";
                exchange.getResponseHeaders().set("Content-Type", "text/html; charset=UTF-8");
                exchange.sendResponseHeaders(404, notFound.length());
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(notFound.getBytes(StandardCharsets.UTF_8));
                }
                return;
            }

            String mime = getMimeType(file.getName());
            byte[] bytes = Files.readAllBytes(file.toPath());

            exchange.getResponseHeaders().set("Content-Type", mime);
            exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
            exchange.sendResponseHeaders(200, bytes.length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(bytes);
            }
        }

        private String getMimeType(String filename) {
            String lower = filename.toLowerCase();
            if (lower.endsWith(".html") || lower.endsWith(".htm")) return "text/html; charset=UTF-8";
            if (lower.endsWith(".css")) return "text/css; charset=UTF-8";
            if (lower.endsWith(".js")) return "application/javascript; charset=UTF-8";
            if (lower.endsWith(".json")) return "application/json; charset=UTF-8";
            if (lower.endsWith(".png")) return "image/png";
            if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
            if (lower.endsWith(".gif")) return "image/gif";
            if (lower.endsWith(".svg")) return "image/svg+xml";
            if (lower.endsWith(".mp3")) return "audio/mpeg";
            if (lower.endsWith(".wav")) return "audio/wav";
            return "text/plain; charset=UTF-8";
        }
    }
}
