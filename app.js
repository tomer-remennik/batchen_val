"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const initReverseVideo = () => __awaiter(void 0, void 0, void 0, function* () {
    const loader = document.getElementById('loader');
    const content = document.getElementById('main-content');
    const video = document.getElementById('bg-video');
    if (!video || !loader || !content)
        return;
    const maxSpeed = 0.02;
    const edgeBuffer = 0.1;
    let direction = 1;
    const maxRetries = 3;
    let attempts = 0;
    let success = false;
    while (attempts < maxRetries && !success) {
        try {
            attempts++;
            const response = yield fetch('./images/output_240.mp4');
            if (!response.ok)
                throw new Error(`Status ${response.status}`);
            const blob = yield response.blob();
            video.src = URL.createObjectURL(blob);
            yield new Promise((resolve) => {
                video.oncanplaythrough = resolve;
            });
            success = true;
        }
        catch (err) {
            console.error("Video preload failed:", err);
            if (attempts >= maxRetries)
                return;
            yield new Promise(resolve => setTimeout(resolve, 500));
        }
    }
    video.muted = true;
    video.pause();
    video.currentTime = edgeBuffer;
    loader.style.transition = 'opacity 1.5s ease';
    loader.style.opacity = '0';
    content.style.opacity = '1';
    setTimeout(() => {
        loader.style.display = 'none';
    }, 1500);
    const handleYoYo = () => {
        if (video.seeking) {
            requestAnimationFrame(handleYoYo);
            return;
        }
        const duration = video.duration;
        const start = edgeBuffer;
        const end = duration - edgeBuffer;
        const currentPos = video.currentTime;
        const progress = (currentPos - start) / (end - start);
        const speedCurve = 1 - (0.5 * progress * (1 - progress));
        const currentSpeed = maxSpeed * speedCurve;
        if (direction === 1) {
            video.currentTime += currentSpeed;
            if (video.currentTime >= end) {
                video.currentTime = end;
                direction = -1;
            }
        }
        else {
            video.currentTime -= currentSpeed;
            if (video.currentTime <= start) {
                video.currentTime = start;
                direction = 1;
            }
        }
        requestAnimationFrame(handleYoYo);
    };
    video.addEventListener('play', () => video.pause());
    handleYoYo();
});
initReverseVideo().then(() => {
});
const moveButton = (noBtn, yesBtn) => {
    if (noBtn.style.position !== 'fixed') {
        const initialRect = noBtn.getBoundingClientRect();
        Object.assign(noBtn.style, {
            position: 'fixed',
            left: `${initialRect.left}px`,
            top: `${initialRect.top}px`,
            margin: '0',
            zIndex: '1000'
        });
        noBtn.offsetHeight;
    }
    const noRect = noBtn.getBoundingClientRect();
    const yesRect = yesBtn.getBoundingClientRect();
    const maxX = window.innerWidth - noRect.width;
    const maxY = window.innerHeight - noRect.height;
    let randomX = 0;
    let randomY = 0;
    let isOverlapping = true;
    let attempts = 0;
    while (isOverlapping && attempts < 50) {
        randomX = Math.floor(Math.random() * maxX);
        randomY = Math.floor(Math.random() * maxY);
        const buffer = 20;
        const overlapX = randomX + noRect.width > yesRect.left - buffer &&
            randomX < yesRect.right + buffer;
        const overlapY = randomY + noRect.height > yesRect.top - buffer &&
            randomY < yesRect.bottom + buffer;
        if (!(overlapX && overlapY)) {
            isOverlapping = false;
        }
        attempts++;
    }
    Object.assign(noBtn.style, {
        position: 'fixed',
        left: `${randomX}px`,
        top: `${randomY}px`,
        margin: '0',
        zIndex: '1000',
        transition: 'all 0.2s ease'
    });
};
const initDodgingButton = () => {
    const noBtn = document.querySelector('.no');
    const yesBtn = document.querySelector('.yes');
    if (noBtn && yesBtn) {
        noBtn.addEventListener('mouseover', () => moveButton(noBtn, yesBtn));
        noBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            moveButton(noBtn, yesBtn);
        });
    }
};
document.addEventListener('DOMContentLoaded', initDodgingButton);
const handleYesClick = () => {
    const buttonContainer = document.querySelector('.button-container');
    if (buttonContainer)
        buttonContainer.setAttribute('style', 'display: none');
    const duration = 4 * 1000;
    const end = Date.now() + duration;
    const colors = ['#f44336', '#ffb7b7', '#ff8a8a'];
    (function frame() {
        confetti({
            particleCount: 2,
            angle: 75,
            spread: 40,
            origin: { x: 0, y: 0.8 },
            colors: colors,
            scalar: 2,
            startVelocity: 100,
            gravity: 0.75
        });
        confetti({
            particleCount: 2,
            angle: 105,
            spread: 40,
            origin: { x: 1, y: 0.8 },
            colors: colors,
            scalar: 2,
            startVelocity: 100,
            gravity: 0.75
        });
        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
    const h1 = document.querySelector('h1');
    if (h1)
        h1.innerText = "יששששש! תודה בת-חני! זכית בקרפ ומלא נשיקות :)";
};
const yesBtn = document.querySelector('.yes');
if (yesBtn) {
    yesBtn.addEventListener('click', handleYesClick);
}
