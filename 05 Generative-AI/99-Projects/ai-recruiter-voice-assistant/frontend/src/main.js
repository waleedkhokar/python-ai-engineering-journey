import * as VapiModule from "@vapi-ai/web";
import "./style.css";

const Vapi =
    VapiModule.default?.default ??
    VapiModule.default ??
    VapiModule;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const VAPI_PUBLIC_KEY = import.meta.env.VITE_VAPI_PUBLIC_KEY;

const vapi = new Vapi(VAPI_PUBLIC_KEY);

let currentLocalCallId = null;
let currentVapiCallId = null;
let callStartedAt = null;
let timerInterval = null;

const candidateIdInput = document.querySelector("#candidate-id");
const startButton = document.querySelector("#start-button");
const endButton = document.querySelector("#end-button");
const statusElement = document.querySelector("#status");
const statusDetailElement = document.querySelector("#status-detail");
const interviewCard = document.querySelector("#interview-card");
const durationElement = document.querySelector("#call-duration span");
const formGroup = document.querySelector(".form-group");

function setStatus(title, detail, state = "ready") {
    statusElement.textContent = title;
    statusDetailElement.textContent = detail;
    interviewCard.dataset.state = state;
    interviewCard.setAttribute("aria-busy", String(state === "connecting"));
}

function setControls({ candidateDisabled, startDisabled, endDisabled }) {
    candidateIdInput.disabled = candidateDisabled;
    startButton.disabled = startDisabled;
    endButton.disabled = endDisabled;
}

function getErrorMessage(errorData, fallback) {
    if (typeof errorData?.detail === "string") {
        return errorData.detail;
    }

    if (typeof errorData?.detail?.message === "string") {
        return errorData.detail.message;
    }

    return fallback;
}

function formatDuration(elapsedMilliseconds) {
    const totalSeconds = Math.max(0, Math.floor(elapsedMilliseconds / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = String(totalSeconds % 60).padStart(2, "0");

    return `${minutes}:${seconds}`;
}

function startTimer() {
    stopTimer(false);
    callStartedAt = Date.now();
    durationElement.textContent = "0:00";

    timerInterval = window.setInterval(() => {
        durationElement.textContent = formatDuration(Date.now() - callStartedAt);
    }, 1000);
}

function stopTimer(reset = false) {
    if (timerInterval) {
        window.clearInterval(timerInterval);
        timerInterval = null;
    }

    if (reset) {
        callStartedAt = null;
        durationElement.textContent = "5–10 min";
    }
}

async function createLocalVoiceSession(candidateId) {
    const response = await fetch(
        `${API_BASE_URL}/voice-sessions/start`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                candidate_id: candidateId,
            }),
        },
    );

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
            getErrorMessage(errorData, "We could not prepare your interview."),
        );
    }

    return response.json();
}

async function linkVapiCall(localCallId, vapiCallId) {
    const response = await fetch(
        `${API_BASE_URL}/voice-sessions/${localCallId}/vapi-call`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                vapi_call_id: vapiCallId,
            }),
        },
    );

    if (!response.ok) {
        throw new Error("We could not finish connecting your interview.");
    }

    return response.json();
}

async function startInterview() {
    const candidateId = Number(candidateIdInput.value);

    if (!Number.isInteger(candidateId) || candidateId < 1) {
        formGroup.classList.add("has-error");
        candidateIdInput.setAttribute("aria-invalid", "true");
        setStatus(
            "Candidate ID required",
            "Enter the valid ID from your invitation email.",
            "error",
        );
        candidateIdInput.focus();
        return;
    }

    try {
        formGroup.classList.remove("has-error");
        candidateIdInput.removeAttribute("aria-invalid");
        setControls({
            candidateDisabled: true,
            startDisabled: true,
            endDisabled: true,
        });

        setStatus(
            "Checking your microphone",
            "Your browser may ask for permission to use it.",
            "connecting",
        );
        await verifyMicrophoneAccess();

        setStatus(
            "Preparing your interview",
            "We are loading your candidate details securely.",
            "connecting",
        );
        const session = await createLocalVoiceSession(candidateId);
        currentLocalCallId = session.local_call_id;

        const assistantOverrides = {
            variableValues: {
                candidate_id: String(session.candidate_id),
                call_id: String(session.local_call_id),
                candidate_name: session.candidate_name,
            },
        };

        setStatus(
            "Connecting to your recruiter",
            "This should take only a few seconds.",
            "connecting",
        );

        const call = await vapi.start(
            undefined,
            assistantOverrides,
            session.squad_id,
        );

        if (call?.id) {
            currentVapiCallId = call.id;
            await linkVapiCall(currentLocalCallId, currentVapiCallId);
        }
    } catch (error) {
        console.error(error);
        stopTimer(true);
        setStatus(
            "Unable to start the interview",
            error.message || "Please check your connection and try again.",
            "error",
        );
        setControls({
            candidateDisabled: false,
            startDisabled: false,
            endDisabled: true,
        });
    }
}

async function verifyMicrophoneAccess() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
        });

        const audioTracks = stream.getAudioTracks();

        if (audioTracks.length === 0) {
            throw new Error("No microphone was found on this device.");
        }

        stream.getTracks().forEach((track) => track.stop());
        return true;
    } catch (error) {
        console.error("Microphone test failed:", error);
        throw new Error(
            "Microphone access failed. Check your browser and Windows permissions.",
        );
    }
}

function endInterview() {
    endButton.disabled = true;
    setStatus(
        "Finishing your interview",
        "Please wait while we close the voice session.",
        "connecting",
    );
    vapi.stop();
}

vapi.on("call-start", () => {
    startTimer();
    setStatus(
        "Interview in progress",
        "The AI recruiter is listening. Speak naturally.",
        "live",
    );
    setControls({
        candidateDisabled: true,
        startDisabled: true,
        endDisabled: false,
    });
});

vapi.on("call-end", () => {
    stopTimer(false);
    setStatus(
        "Interview complete",
        "Thank you—your responses have been recorded.",
        "complete",
    );
    setControls({
        candidateDisabled: false,
        startDisabled: false,
        endDisabled: true,
    });
    currentLocalCallId = null;
    currentVapiCallId = null;
});

vapi.on("error", (error) => {
    console.error("Vapi error:", error);
    stopTimer(true);
    setStatus(
        "Voice connection interrupted",
        "Check your internet connection, then try again.",
        "error",
    );
    setControls({
        candidateDisabled: false,
        startDisabled: false,
        endDisabled: true,
    });
});

candidateIdInput.addEventListener("input", () => {
    formGroup.classList.remove("has-error");
    candidateIdInput.removeAttribute("aria-invalid");

    if (interviewCard.dataset.state === "error") {
        setStatus(
            "Ready to begin",
            "Enter your candidate ID to start the interview.",
            "ready",
        );
    }
});

candidateIdInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !startButton.disabled) {
        startInterview();
    }
});

startButton.addEventListener("click", startInterview);
endButton.addEventListener("click", endInterview);

setStatus(
    "Ready to begin",
    "Enter your candidate ID to start the interview.",
    "ready",
);
