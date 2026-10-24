
/* =====================================================
   AARU'S WEDDING INVITATION
   FULL UPDATED JAVASCRIPT
   File: script.js
===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* =====================================================
     1. WEDDING DETAILS
  ===================================================== */

  const weddingDetails = {
    brideName: "A. Kalaivani",
    groomName: "M. Jothimani",

    // Local wedding time: 25 October 2026, 6:30 AM
    weddingDate: "2026-10-25T06:30:00",
    weddingTime: "6:30 AM",

    venueName: "Sri Balamurugan Mahal",
    venueAddress: "Palani, Tamil Nadu, India",

    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Sri+Balamurugan+Mahal+Palani+Tamil+Nadu",

    // International format, digits only.
    groomWhatsAppNumber: "918754035629"
  };


  /* =====================================================
     2. HELPERS
  ===================================================== */

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];

  const byId = (id) => document.getElementById(id);

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  function scrollToSection(section) {
    if (!section) return;

    section.scrollIntoView({
      behavior: prefersReducedMotion.matches ? "auto" : "smooth",
      block: "center"
    });
  }

  function setText(id, value) {
    const element = byId(id);
    if (element) element.textContent = value;
  }

  function safeDate(value) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  function setButtonDisabled(button, disabled) {
    if (button) button.disabled = disabled;
  }


  /* =====================================================
     3. POPULATE WEDDING DETAILS
  ===================================================== */

  setText("brideName", weddingDetails.brideName);
  setText("groomName", weddingDetails.groomName);
  setText("venueName", weddingDetails.venueName);
  setText("venueAddress", weddingDetails.venueAddress);
  setText("weddingTimeText", weddingDetails.weddingTime);
  setText("venueTimeDetail", weddingDetails.weddingTime);

  const weddingDate = safeDate(weddingDetails.weddingDate);

  if (weddingDate) {
    const formattedDate = new Intl.DateTimeFormat("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(weddingDate);

    setText("weddingDateText", formattedDate);
    setText("venueDateDetail", formattedDate);
  } else {
    setText("weddingDateText", "Wedding date to be announced");
    setText("venueDateDetail", "Date to be announced");
  }

  const mapLink = byId("mapLink");

  if (mapLink) {
    mapLink.href = weddingDetails.mapUrl;
    mapLink.target = "_blank";
    mapLink.rel = "noopener noreferrer";
  }


  /* =====================================================
     4. SCROLL SECTION HIGHLIGHT
  ===================================================== */

  const sections = $$(".scene");

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle(
            "is-active",
            entry.isIntersecting
          );
        });
      },
      {
        root: null,
        rootMargin: "-20% 0px -20% 0px",
        threshold: 0
      }
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  } else {
    sections.forEach((section) => {
      section.classList.add("is-active");
    });
  }


  /* =====================================================
     5. BACKGROUND MUSIC
     Starts after the invitation ribbon is touched.
  ===================================================== */

  const music = byId("backgroundMusic");
  const musicToggle = byId("musicToggle");
  const musicLabel = byId("musicLabel");

  function updateMusicButton(isPlaying) {
    if (musicLabel) {
      musicLabel.textContent = isPlaying
        ? "Pause Music"
        : "Play Music";
    }

    if (musicToggle) {
      musicToggle.setAttribute(
        "aria-label",
        isPlaying
          ? "Pause background music"
          : "Play background music"
      );

      musicToggle.setAttribute(
        "aria-pressed",
        String(isPlaying)
      );
    }
  }

  async function playMusic() {
    if (!music) return false;

    try {
      await music.play();
      updateMusicButton(true);
      return true;
    } catch (error) {
      // Some browsers require another direct user interaction.
      updateMusicButton(false);
      return false;
    }
  }

  function pauseMusic() {
    if (!music) return;

    music.pause();
    updateMusicButton(false);
  }

  if (music) {
    music.addEventListener("play", () => updateMusicButton(true));
    music.addEventListener("pause", () => updateMusicButton(false));
    music.addEventListener("ended", () => updateMusicButton(false));
  }

  if (musicToggle) {
    musicToggle.addEventListener("click", () => {
      if (!music) return;

      if (music.paused) {
        playMusic();
      } else {
        pauseMusic();
      }
    });
  }


  /* =====================================================
     6. RIBBON -> TEMPLE DOORS
  ===================================================== */

  const ribbonScene = byId("ribbonOpening");
  const ribbonStart = byId("ribbonStart");
  const doorScene = byId("doorScene");

  const doorCard = $(".door-card");
  const doorFrame = $(".door-frame");

  let ribbonOpened = false;
  let doorsOpened = false;
  let ribbonTimer = null;

  function openTempleDoors() {
    if (doorsOpened) return;

    doorsOpened = true;

    if (doorFrame) {
      doorFrame.classList.add("doors-open");
    }

    if (doorCard) {
      doorCard.classList.add("doors-open");
    }
  }

  if (ribbonStart) {
    ribbonStart.addEventListener("click", async () => {
      if (ribbonOpened) return;

      ribbonOpened = true;
      setButtonDisabled(ribbonStart, true);

      // Browser audio autoplay restrictions are handled safely.
      playMusic();

      if (ribbonScene) {
        ribbonScene.classList.add("is-opening");
      }

      ribbonTimer = window.setTimeout(() => {
        openTempleDoors();
        scrollToSection(doorScene);
        ribbonTimer = null;
      }, 700);
    });
  }


  /* =====================================================
     7. BRIDE + GROOM DRAG INTERACTION
     Drag the two figures toward each other.
  ===================================================== */

  const coupleStage = byId("coupleStage");
  const bridePerson = byId("bridePerson");
  const groomPerson = byId("groomPerson");
  const heartEffect = byId("heartEffect");
  const liftScene = byId("liftScene");

  let coupleTogether = false;
  let activeDrag = null;
  let coupleTimer = null;

  const personPositions = new Map();

  function currentTranslateX(element) {
    return personPositions.get(element) || 0;
  }

  function setTranslateX(element, x) {
    if (!element) return;

    personPositions.set(element, x);
    element.style.transform = `translateX(${x}px)`;
  }

  function getVisualCenterX(element) {
    const rect = element.getBoundingClientRect();
    return rect.left + rect.width / 2;
  }

  function snapCoupleTogether() {
    if (!coupleStage || !bridePerson || !groomPerson) return;

    const stageWidth = coupleStage.getBoundingClientRect().width;
    const movement = stageWidth * 0.16;

    bridePerson.classList.remove("dragging");
    groomPerson.classList.remove("dragging");

    bridePerson.classList.add("moving-to-partner");
    groomPerson.classList.add("moving-to-partner");

    setTranslateX(bridePerson, movement);
    setTranslateX(groomPerson, -movement);

    if (heartEffect) {
      heartEffect.classList.remove("show-heart");
      void heartEffect.offsetWidth;
      heartEffect.classList.add("show-heart");
    }

    coupleTimer = window.setTimeout(() => {
      if (coupleTogether) {
        scrollToSection(liftScene);
      }
      coupleTimer = null;
    }, 1000);
  }

  function checkCoupleDistance() {
    if (
      !coupleStage ||
      !bridePerson ||
      !groomPerson ||
      coupleTogether
    ) {
      return;
    }

    const brideCenter = getVisualCenterX(bridePerson);
    const groomCenter = getVisualCenterX(groomPerson);

    const gap = Math.abs(groomCenter - brideCenter);
    const allowedGap =
      coupleStage.getBoundingClientRect().width * 0.27;

    if (gap <= allowedGap) {
      coupleTogether = true;

      bridePerson.classList.add("together");
      groomPerson.classList.add("together");

      snapCoupleTogether();
    }
  }

  function onDragStart(event) {
    if (coupleTogether || activeDrag) return;

    if (event.button !== undefined && event.button !== 0) return;

    const element = event.currentTarget;

    activeDrag = {
      element,
      pointerId: event.pointerId,
      startX: event.clientX,
      initialX: currentTranslateX(element)
    };

    element.classList.remove("moving-to-partner");
    element.classList.add("dragging");

    try {
      element.setPointerCapture(event.pointerId);
    } catch (error) {
      // Continue without pointer capture if unsupported.
    }

    event.preventDefault();
  }

  function onDragMove(event) {
    if (!activeDrag) return;
    if (event.pointerId !== activeDrag.pointerId) return;

    const deltaX = event.clientX - activeDrag.startX;
    const element = activeDrag.element;

    setTranslateX(element, activeDrag.initialX + deltaX);
    checkCoupleDistance();
  }

  function onDragEnd(event) {
    if (!activeDrag) return;

    if (
      event.pointerId !== undefined &&
      event.pointerId !== activeDrag.pointerId
    ) {
      return;
    }

    activeDrag.element.classList.remove("dragging");
    activeDrag = null;

    checkCoupleDistance();
  }

  [bridePerson, groomPerson].forEach((person) => {
    if (!person) return;

    person.addEventListener("pointerdown", onDragStart);
    person.addEventListener("pointermove", onDragMove);
    person.addEventListener("pointerup", onDragEnd);
    person.addEventListener("pointercancel", onDragEnd);
  });


  /* =====================================================
     8. SCRATCH TO REVEAL THE NAMES
  ===================================================== */

  const scratchArea = byId("scratchArea");
  const scratchCanvas = byId("scratchCanvas");
  const scratchHint = byId("scratchHint");
  const nameCelebration = byId("nameCelebration");

  const scratchContext = scratchCanvas
    ? scratchCanvas.getContext("2d", {
        willReadFrequently: true
      })
    : null;

  let scratchActive = false;
  let scratchRevealed = false;
  let scratchLastPoint = null;
  let scratchCheckTimer = null;

  function setupScratchCanvas() {
    if (!scratchCanvas || !scratchContext || !scratchArea) return;
    if (scratchRevealed) return;

    const rect = scratchArea.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const pixelRatio = Math.max(
      1,
      Math.min(window.devicePixelRatio || 1, 2)
    );

    scratchCanvas.width = Math.round(rect.width * pixelRatio);
    scratchCanvas.height = Math.round(rect.height * pixelRatio);

    scratchCanvas.style.width = `${rect.width}px`;
    scratchCanvas.style.height = `${rect.height}px`;

    scratchContext.setTransform(
      pixelRatio,
      0,
      0,
      pixelRatio,
      0,
      0
    );

    const gradient = scratchContext.createLinearGradient(
      0,
      0,
      rect.width,
      rect.height
    );

    gradient.addColorStop(0, "#B9CBB6");
    gradient.addColorStop(0.5, "#D9AEBB");
    gradient.addColorStop(1, "#E9C8D0");

    scratchContext.globalCompositeOperation = "source-over";
    scratchContext.fillStyle = gradient;
    scratchContext.fillRect(0, 0, rect.width, rect.height);

    scratchContext.fillStyle = "rgba(255,255,255,0.17)";

    scratchContext.beginPath();
    scratchContext.arc(
      rect.width * 0.16,
      rect.height * 0.17,
      rect.width * 0.19,
      0,
      Math.PI * 2
    );
    scratchContext.fill();

    scratchContext.beginPath();
    scratchContext.arc(
      rect.width * 0.88,
      rect.height * 0.80,
      rect.width * 0.25,
      0,
      Math.PI * 2
    );
    scratchContext.fill();

    scratchContext.fillStyle = "rgba(255,255,255,0.96)";
    scratchContext.textAlign = "center";
    scratchContext.textBaseline = "middle";
    scratchContext.font =
      "500 21px 'Cormorant Garamond', Georgia, serif";

    scratchContext.fillText(
      "Scratch to reveal",
      rect.width / 2,
      rect.height / 2 - 7
    );

    scratchContext.font = "14px Arial, sans-serif";

    scratchContext.fillText(
      "Use your finger",
      rect.width / 2,
      rect.height / 2 + 22
    );

    scratchContext.globalCompositeOperation = "destination-out";
  }

  function scratchPoint(event) {
    const rect = scratchCanvas.getBoundingClientRect();

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }

  function eraseScratchLine(point) {
    if (!scratchContext || !scratchLastPoint) return;

    scratchContext.globalCompositeOperation = "destination-out";
    scratchContext.lineCap = "round";
    scratchContext.lineJoin = "round";
    scratchContext.lineWidth = 34;

    scratchContext.beginPath();
    scratchContext.moveTo(
      scratchLastPoint.x,
      scratchLastPoint.y
    );
    scratchContext.lineTo(point.x, point.y);
    scratchContext.stroke();

    scratchLastPoint = point;
  }

  function checkScratchProgress() {
    if (!scratchCanvas || !scratchContext || scratchRevealed) return;

    try {
      const width = scratchCanvas.width;
      const height = scratchCanvas.height;

      if (!width || !height) return;

      const pixels = scratchContext.getImageData(
        0,
        0,
        width,
        height
      ).data;

      // Sample periodically for better performance on mobile.
      const stride = 32;
      let transparentPixels = 0;
      let sampledPixels = 0;

      for (let i = 3; i < pixels.length; i += stride * 4) {
        sampledPixels++;

        if (pixels[i] < 80) {
          transparentPixels++;
        }
      }

      if (
        sampledPixels > 0 &&
        transparentPixels / sampledPixels >= 0.42
      ) {
        revealNames();
      }
    } catch (error) {
      // If pixel inspection fails, guests can continue scratching.
    }
  }

  function revealNames() {
    if (scratchRevealed) return;

    scratchRevealed = true;
    scratchActive = false;
    scratchLastPoint = null;

    if (scratchCheckTimer !== null) {
      window.clearTimeout(scratchCheckTimer);
      scratchCheckTimer = null;
    }

    if (scratchCanvas) {
      scratchCanvas.style.transition = "opacity 0.65s ease";
      scratchCanvas.style.opacity = "0";
      scratchCanvas.style.pointerEvents = "none";
    }

    if (scratchHint) {
      scratchHint.textContent =
        "Wishing you a lifetime of love ♥";
    }

    if (nameCelebration) {
      nameCelebration.classList.add("celebration-active");
    }

    window.setTimeout(() => {
      if (scratchCanvas) {
        scratchCanvas.hidden = true;
      }
    }, 700);
  }

  if (scratchCanvas && scratchContext && scratchArea) {
    setupScratchCanvas();

    scratchCanvas.addEventListener("pointerdown", (event) => {
      if (scratchRevealed) return;

      scratchActive = true;
      scratchLastPoint = scratchPoint(event);

      try {
        scratchCanvas.setPointerCapture(event.pointerId);
      } catch (error) {
        // Continue without pointer capture if unsupported.
      }

      event.preventDefault();
    });

    scratchCanvas.addEventListener("pointermove", (event) => {
      if (!scratchActive || scratchRevealed) return;

      eraseScratchLine(scratchPoint(event));
    });

    scratchCanvas.addEventListener("pointerup", () => {
      if (!scratchActive) return;

      scratchActive = false;
      scratchLastPoint = null;

      checkScratchProgress();
    });

    scratchCanvas.addEventListener("pointercancel", () => {
      scratchActive = false;
      scratchLastPoint = null;
    });

    scratchCanvas.addEventListener("lostpointercapture", () => {
      scratchActive = false;
      scratchLastPoint = null;
    });
  }


  /* =====================================================
     9. GIFT BOX -> RINGS -> COUNTDOWN
  ===================================================== */

  const giftCard = $(".gift-card");
  const giftOpen = byId("giftOpen");
  const giftReveal = byId("giftReveal");
  const dateScene = byId("dateScene");

  let giftOpened = false;
  let giftRevealTimer = null;
  let giftScrollTimer = null;

  if (giftOpen && giftCard && giftReveal) {
    giftOpen.addEventListener("click", () => {
      if (giftOpened) return;

      giftOpened = true;

      giftOpen.setAttribute("aria-expanded", "true");
      giftOpen.disabled = true;
      giftCard.classList.add("is-opening");

      giftRevealTimer = window.setTimeout(() => {
        giftOpen.hidden = true;
        giftReveal.classList.add("revealed");
        giftRevealTimer = null;
      }, 700);

      giftScrollTimer = window.setTimeout(() => {
        scrollToSection(dateScene);
        giftScrollTimer = null;
      }, 2500);
    });
  }


  /* =====================================================
     10. WEDDING COUNTDOWN
  ===================================================== */

  let countdownTimer = null;

  function updateCountdown() {
    if (!weddingDate) return;

    const difference = weddingDate.getTime() - Date.now();

    if (difference <= 0) {
      setText("countDays", "00");
      setText("countHours", "00");
      setText("countMinutes", "00");
      setText("countSeconds", "00");

      if (countdownTimer !== null) {
        window.clearInterval(countdownTimer);
        countdownTimer = null;
      }

      return;
    }

    const totalSeconds = Math.floor(difference / 1000);

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    setText("countDays", String(days).padStart(2, "0"));
    setText("countHours", String(hours).padStart(2, "0"));
    setText("countMinutes", String(minutes).padStart(2, "0"));
    setText("countSeconds", String(seconds).padStart(2, "0"));
  }

  updateCountdown();
  countdownTimer = window.setInterval(updateCountdown, 1000);


  /* =====================================================
     11. ENVELOPE -> INVITATION
  ===================================================== */

  const invitationCard = $(".invitation-card");
  const envelopeOpen = byId("envelopeOpen");
  const invitationReveal = byId("invitationReveal");

  let invitationOpened = false;
  let envelopeTimer = null;

  if (envelopeOpen && invitationCard && invitationReveal) {
    envelopeOpen.addEventListener("click", () => {
      if (invitationOpened) return;

      invitationOpened = true;

      envelopeOpen.setAttribute("aria-expanded", "true");
      envelopeOpen.disabled = true;

      invitationCard.classList.add("is-opening");

      envelopeTimer = window.setTimeout(() => {
        envelopeOpen.hidden = true;
        invitationReveal.classList.add("revealed");
        envelopeTimer = null;
      }, 650);
    });
  }


  /* =====================================================
     12. DOWNLOAD INVITATION IMAGE
  ===================================================== */

  const downloadInvitation = byId("downloadInvitation");

  if (downloadInvitation) {
    downloadInvitation.addEventListener("click", () => {
      const image = $(
        "#invitationReveal .invitation-image"
      );

      if (!image) {
        window.alert("Invitation image could not be found.");
        return;
      }

      const source = image.getAttribute("src");

      if (!source) {
        window.alert("Please check the invitation image path.");
        return;
      }

      const link = document.createElement("a");

      link.href = image.src;
      link.download = "Wedding-Invitation.png";
      link.rel = "noopener";

      document.body.appendChild(link);
      link.click();
      link.remove();
    });
  }


  /* =====================================================
     13. GUEST WISHES -> WHATSAPP
  ===================================================== */

  const wishesForm = byId("wishesForm");
  const guestName = byId("guestName");
  const guestMessage = byId("guestMessage");

  if (wishesForm && guestName && guestMessage) {
    wishesForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = guestName.value.trim();
      const message = guestMessage.value.trim();

      if (!name || !message) {
        window.alert("Please enter your name and wishes.");
        return;
      }

      const phone = weddingDetails.groomWhatsAppNumber;

      if (!/^\d{10,15}$/.test(phone)) {
        window.alert(
          "Please check the WhatsApp number in script.js."
        );
        return;
      }

      const text =
        `Wedding Wishes\n\nFrom: ${name}\n\n${message}`;

      const url =
        `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;

      const whatsappWindow = window.open(
        url,
        "_blank",
        "noopener,noreferrer"
      );

      if (!whatsappWindow) {
        // Fallback for browsers that block a new tab.
        window.location.href = url;
      }
    });
  }


  /* =====================================================
     14. VIDEO BEHAVIOUR
     Pause videos when they leave the viewport.
  ===================================================== */

  const videos = $$("video");

  if ("IntersectionObserver" in window) {
    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && !entry.target.paused) {
            entry.target.pause();
          }
        });
      },
      {
        threshold: 0.15
      }
    );

    videos.forEach((video) => {
      videoObserver.observe(video);
    });
  }


  /* =====================================================
     15. REPLAY THE INVITATION
     Reset interactions and return to the ribbon.
  ===================================================== */

  const replayButton = byId("replayInvitation");

  function clearPendingTimer(timer) {
    if (timer !== null) {
      window.clearTimeout(timer);
    }
  }

  function resetCoupleInteraction() {
    coupleTogether = false;
    activeDrag = null;
    personPositions.clear();

    clearPendingTimer(coupleTimer);
    coupleTimer = null;

    [bridePerson, groomPerson].forEach((person) => {
      if (!person) return;

      person.classList.remove(
        "dragging",
        "moving-to-partner",
        "together"
      );

      person.style.transform = "";
    });

    if (heartEffect) {
      heartEffect.classList.remove("show-heart");
    }
  }

  function resetScratchInteraction() {
    scratchActive = false;
    scratchRevealed = false;
    scratchLastPoint = null;

    clearPendingTimer(scratchCheckTimer);
    scratchCheckTimer = null;

    if (scratchCanvas) {
      scratchCanvas.hidden = false;
      scratchCanvas.style.opacity = "1";
      scratchCanvas.style.pointerEvents = "auto";
      scratchCanvas.style.transition = "";
    }

    if (nameCelebration) {
      nameCelebration.classList.remove("celebration-active");
    }

    if (scratchHint) {
      scratchHint.textContent =
        "Use your finger to reveal the couple's names";
    }

    setupScratchCanvas();
  }

  function resetGiftInteraction() {
    giftOpened = false;

    clearPendingTimer(giftRevealTimer);
    clearPendingTimer(giftScrollTimer);

    giftRevealTimer = null;
    giftScrollTimer = null;

    if (giftCard) {
      giftCard.classList.remove("is-opening");
    }

    if (giftOpen) {
      giftOpen.hidden = false;
      giftOpen.disabled = false;
      giftOpen.setAttribute("aria-expanded", "false");
    }

    if (giftReveal) {
      giftReveal.classList.remove("revealed");
    }
  }

  function resetInvitationInteraction() {
    invitationOpened = false;

    clearPendingTimer(envelopeTimer);
    envelopeTimer = null;

    if (invitationCard) {
      invitationCard.classList.remove("is-opening");
    }

    if (envelopeOpen) {
      envelopeOpen.hidden = false;
      envelopeOpen.disabled = false;
      envelopeOpen.setAttribute("aria-expanded", "false");
    }

    if (invitationReveal) {
      invitationReveal.classList.remove("revealed");
    }
  }

  function resetRibbonAndDoors() {
    ribbonOpened = false;
    doorsOpened = false;

    clearPendingTimer(ribbonTimer);
    ribbonTimer = null;

    if (ribbonScene) {
      ribbonScene.classList.remove("is-opening");
    }

    if (ribbonStart) {
      ribbonStart.disabled = false;
    }

    if (doorFrame) {
      doorFrame.classList.remove("doors-open");
    }

    if (doorCard) {
      doorCard.classList.remove("doors-open");
    }
  }

  function resetVideos() {
    videos.forEach((video) => {
      video.pause();

      try {
        video.currentTime = 0;
      } catch (error) {
        // A video may not have loaded metadata yet.
      }
    });
  }

  if (replayButton) {
    replayButton.addEventListener("click", () => {
      // Music
      if (music) {
        music.pause();

        try {
          music.currentTime = 0;
        } catch (error) {
          // Ignore if audio is not ready.
        }
      }

      updateMusicButton(false);

      // Reset opening scenes
      resetRibbonAndDoors();

      // Reset interactive scenes
      resetCoupleInteraction();
      resetScratchInteraction();
      resetGiftInteraction();
      resetInvitationInteraction();

      // Reset videos and guest form
      resetVideos();

      if (wishesForm) {
        wishesForm.reset();
      }

      // Return to the start
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion.matches ? "auto" : "smooth"
      });
    });
  }


  /* =====================================================
     16. INITIAL STATE
  ===================================================== */

  updateMusicButton(false);

  console.log("Aaru's Wedding Invitation is ready.");

});
