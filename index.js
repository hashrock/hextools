const Buffer = window.buffer.Buffer

new Vue({
    el: "main",
    data: {
        scratchpad: "00 ff 11 22 33 44",
        input: ""
    },
    methods: {
        appendx: function(){
            this.scratchpad = this.scratchpad.replace(/([0-f][0-f])/g, "0x$1")
        },
        removex: function(){
            this.scratchpad = this.scratchpad.replace(/0x/g, "")
        },
        removespace: function(){
            this.scratchpad = this.scratchpad.replace(/,/g, "").replace(/ /g, "")
        },
        
        addspace: function(){
            this.scratchpad = this.scratchpad.replace(/([0-f][0-f])/g, "$1 ")
        },
        csv: function(){
            this.scratchpad = this.scratchpad.replace(/ /g, ",")
        }

    },
    computed: {
        cleaned: function () {
            return this.input
                .replace(/0x/g, "")
                .replace(/ /g, "")
                .replace(/\n/g, "")
        },

        buffer: function () {
            try {
                if (this.cleaned.match(/[0-f]+/)) {
                    return new Buffer(this.cleaned, "hex")
                }
            } catch (e) {
                return null
            }
            return null
        },

        output: function () {
            const toHex = parseInt(this.input.replace(/ /g, ""), 10)
            try {
                let toNumber = undefined
                if (this.buffer) {
                    toNumber = {
                        UInt8: this.buffer.readUInt8(0),
                        UInt16LE: this.buffer.length > 1 ? this.buffer.readUInt16LE(0) : undefined,
                        UInt16BE: this.buffer.length > 1 ? this.buffer.readUInt16BE(0) : undefined,
                        UInt32LE: this.buffer.length > 3 ? this.buffer.readUInt32LE(0) : undefined,
                        UInt32BE: this.buffer.length > 3 ? this.buffer.readUInt32BE(0) : undefined,
                        Int8: this.buffer.readInt8(0),
                        Int16LE: this.buffer.length > 1 ? this.buffer.readInt16LE(0) : undefined,
                        Int16BE: this.buffer.length > 1 ? this.buffer.readInt16BE(0) : undefined,
                        Int32LE: this.buffer.length > 3 ? this.buffer.readInt32LE(0) : undefined,
                        Int32BE: this.buffer.length > 3 ? this.buffer.readInt32BE(0) : undefined,
                    }
                }
                const output =
                    {
                        toNumber: toNumber,
                        toHex: toHex ? toHex.toString(16) : undefined
                    }
                return JSON.stringify(output, null, 2)
            } catch (e) {
                return "xox"
            }
            return "-_-"
        }
    },
    mounted: function () {
        setInterval(() => {
            const selection = window.getSelection().toString()
            if (selection === "") {
                this.input = this.scratchpad
            } else {
                this.input = selection
            }
        }, 1000)

    }
})