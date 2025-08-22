/* VanillaTilt.js 1.8.0 - for 3D tilt effects - minified */
class VanillaTilt {
    constructor(e, t = {}) {
        if (!(e instanceof Node)) throw "Can't initialize VanillaTilt because " + e + " is not a Node.";
        this.width = null, this.height = null, this.clientWidth = null, this.clientHeight = null, this.left = null, this.top = null, this.gammazero = null, this.betazero = null, this.lastgammazero = null, this.lastbetazero = null, this.transitionTimeout = null, this.updateCall = null, this.event = null, this.updateBind = this.update.bind(this), this.resetBind = this.reset.bind(this), this.element = e, this.settings = this.extendSettings(t), this.reverse = this.settings.reverse ? -1 : 1, this.glare = VanillaTilt.isSettingTrue(this.settings.glare), this.glarePrerender = VanillaTilt.isSettingTrue(this.settings["glare-prerender"]), this.fullPageListening = VanillaTilt.isSettingTrue(this.settings["full-page-listening"]), this.gyroscope = VanillaTilt.isSettingTrue(this.settings.gyroscope), this.gyroscopeSamples = this.settings.gyroscopeSamples, this.elementListener = this.getElementListener(), this.glare && this.prepareGlare(), this.addEventListeners(), this.reset(), this.updateInitialPosition()
    }
    static isSettingTrue(e) { return "" === e || !0 === e || 1 === e }
    getElementListener() { if (this.fullPageListening) return window.document; if ("string" == typeof this.settings["mouse-event-element"]) { const e = document.querySelector(this.settings["mouse-event-element"]); if (e) return e } return this.settings["mouse-event-element"] instanceof Node ? this.settings["mouse-event-element"] : this.element }
    addEventListeners() { this.onMouseEnterBind = this.onMouseEnter.bind(this), this.onMouseMoveBind = this.onMouseMove.bind(this), this.onMouseLeaveBind = this.onMouseLeave.bind(this), this.onWindowResizeBind = this.onWindowResize.bind(this), this.onDeviceOrientationBind = this.onDeviceOrientation.bind(this), this.elementListener.addEventListener("mouseenter", this.onMouseEnterBind), this.elementListener.addEventListener("mouseleave", this.onMouseLeaveBind), this.elementListener.addEventListener("mousemove", this.onMouseMoveBind), (this.glare || this.fullPageListening) && window.addEventListener("resize", this.onWindowResizeBind), this.gyroscope && window.addEventListener("deviceorientation", this.onDeviceOrientationBind) }
    removeEventListeners() { this.elementListener.removeEventListener("mouseenter", this.onMouseEnterBind), this.elementListener.removeEventListener("mouseleave", this.onMouseLeaveBind), this.elementListener.removeEventListener("mousemove", this.onMouseMoveBind), this.gyroscope && window.removeEventListener("deviceorientation", this.onDeviceOrientationBind) }
    destroy() { clearTimeout(this.transitionTimeout), null !== this.updateCall && cancelAnimationFrame(this.updateCall), this.reset(), this.removeEventListeners(), this.element.vanillaTilt = null, delete this.element.vanillaTilt, this.element = null }
    onDeviceOrientation(e) {
        if (null === e.gamma || null === e.beta) return;
        this.updateElementPosition(), this.gyroscopeSamples > 0 && (this.lastgammazero === e.gamma && this.lastbetazero === e.beta || (this.gyroscopeSamples -= 1, this.lastgammazero = e.gamma, this.lastbetazero = e.beta), 0 === this.gyroscopeSamples && (this.gammazero = e.gamma, this.betazero = e.beta));
        const t = (e.gamma - (this.gammazero || 0)) / this.settings.gyroscopeMaxAngleX * (this.settings.max / this.settings.gyroscopeMinAngleX),
            s = (e.beta - (this.betazero || 0)) / this.settings.gyroscopeMaxAngleY * (this.settings.max / this.settings.gyroscopeMinAngleY);
        null !== this.updateCall && cancelAnimationFrame(this.updateCall), this.event = { clientX: this.left + this.clientWidth / 2 + t, clientY: this.top + this.clientHeight / 2 + s }, this.updateCall = requestAnimationFrame(this.updateBind)
    }
    onMouseEnter() { this.updateElementPosition(), this.setTransition() }
    onMouseMove(e) { null !== this.updateCall && cancelAnimationFrame(this.updateCall), this.event = e, this.updateCall = requestAnimationFrame(this.updateBind) }
    onMouseLeave() { this.setTransition(), this.settings.reset && requestAnimationFrame(this.resetBind) }
    reset() { this.event = { clientX: this.left + this.clientWidth / 2, clientY: this.top + this.clientHeight / 2 }, this.element.style.transform = `perspective(${this.settings.perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)` }
    getValues() {
        let e = (this.event.clientX - this.left) / this.clientWidth,
            t = (this.event.clientY - this.top) / this.clientHeight;
        e = Math.min(Math.max(e, 0), 1), t = Math.min(Math.max(t, 0), 1);
        const s = (this.reverse * (this.settings.max / 2 - e * this.settings.max)).toFixed(2),
            i = (this.reverse * (t * this.settings.max - this.settings.max / 2)).toFixed(2),
            n = Math.atan2(this.event.clientY - (this.top + this.clientHeight / 2), this.event.clientX - (this.left + this.clientWidth / 2)) * 180 / Math.PI;
        return { tiltX: s, tiltY: i, percentageX: 100 * e, percentageY: 100 * t, angle: n }
    }
    updateElementPosition() {
        let e = this.element.getBoundingClientRect();
        this.width = this.element.offsetWidth, this.height = this.element.offsetHeight, this.left = e.left, this.top = e.top
    }
    update() {
        let e = this.getValues();
        this.element.style.transform = `perspective(${this.settings.perspective}px) rotateX(${this.settings.axis==="x"?0:e.tiltY}deg) rotateY(${this.settings.axis==="y"?0:e.tiltX}deg) scale3d(${this.settings.scale}, ${this.settings.scale}, ${this.settings.scale})`
    }
    prepareGlare() {
        if (!this.glarePrerender) {
            const e = document.createElement("div");
            e.classList.add("js-tilt-glare");
            const t = document.createElement("div");
            t.classList.add("js-tilt-glare-inner"), e.appendChild(t), this.element.appendChild(e)
        }
        this.glareElementWrapper = this.element.querySelector(".js-tilt-glare"), this.glareElement = this.element.querySelector(".js-tilt-glare-inner"), Object.assign(this.glareElementWrapper.style, { position: "absolute", top: "0", left: "0", width: "100%", height: "100%", overflow: "hidden", "pointer-events": "none" }), Object.assign(this.glareElement.style, { position: "absolute", top: "50%", left: "50%", "pointer-events": "none", transform: "translate(-50%,-50%)", "background-image": "linear-gradient(0deg, rgba(255,255,255,.25) 0%, rgba(255,255,255,0) 80%)", width: `${2*this.element.offsetWidth}px`, height: `${2*this.element.offsetWidth}px`, opacity: "0" }), this.updateGlareSize()
    }
    updateGlareSize() { this.glareElement && (this.glareElement.style.width = `${2*this.element.offsetWidth}px`, this.glareElement.style.height = `${2*this.element.offsetWidth}px`) }
    setTransition() { clearTimeout(this.transitionTimeout), this.element.style.transition = "transform 0.2s ease", this.glareElement && (this.glareElement.style.transition = "opacity 0.2s ease"), this.transitionTimeout = setTimeout(() => { this.element.style.transition = "", this.glareElement && (this.glareElement.style.transition = "") }, 200) }
    static init(e, t) { e instanceof Node && (e = [e]), e instanceof NodeList && (e = [].slice.call(e)), Array.isArray(e) && e.forEach(e => { "vanillaTilt" in e || (e.vanillaTilt = new VanillaTilt(e, t)) }) }
    extendSettings(e) { let t = { reverse: false, max: 15, startX: 0, startY: 0, perspective: 1000, easing: "cubic-bezier(.03,.98,.52,.99)", scale: 1, axis: null, glare: false, "max-glare": 1, "glare-prerender": false, "full-page-listening": false, "mouse-event-element": null, reset: true, gyroscope: true, gyroscopeMinAngleX: -45, gyroscopeMaxAngleX: 45, gyroscopeMinAngleY: -45, gyroscopeMaxAngleY: 45, gyroscopeSamples: 10 }; return Object.assign({}, t, e) }
}
window.VanillaTilt = VanillaTilt;