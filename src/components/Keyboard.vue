<template>
    <div class="keyboard-container">
        <b-row class="mb-3">
          <!--octaves-->
          <b-col class="text-center">
            <p><strong>Octaves ({{ octave }} - {{ (octave + 2) }})</strong></p>
            <b-button variant="primary" class="mr-1" v-bind:class="{'disabled' : octave < 0}" @click="octaveDown"><i class="fas fa-chevron-left"></i></b-button>
            <b-button variant="primary" :class="{'disabled' : octave > 7}" @click="octaveUp"><i class="fas fa-chevron-right"></i></b-button>
          </b-col>
          <!--octaves end-->
          <!--volume-->
          <b-col class="text-center">
            <p><strong>Volume: {{ volumeModel | percentage }}</strong></p>
            <b-form-input type="range" min="0" max="1" step="0.01" v-model="volumeModel"></b-form-input>
          </b-col>
          <!--volume end-->
          <!--instruments slelection-->
          <b-col class="text-center">
            <p><strong>Select instrument</strong></p>
            <b-form-select v-model="selectedInstrument" @change="selectInstrument">
              <option v-for="(instrument, i) in instruments" :value="i">{{ instrument.name }}</option>
            </b-form-select>
          </b-col>
          <!--instruments selection end-->
          <!--visibility options-->
          <b-col>
            <b-form-checkbox switch v-model="showKeyNotes">Show notes</b-form-checkbox>
            <b-form-checkbox switch v-model="showKeyMarks">Show keyboard marks</b-form-checkbox>
          </b-col>
          <!--visibility options end-->
        </b-row>
        <div class="keyboard" :class="{ 'hide-key-notes': !showKeyNotes, 'hide-key-marks': !showKeyMarks }">
          <div v-for="keyNote in keyNotes" class="key-container" :class="{ 'key-black': keyNote.black, 'pressed': keyNote.pressed }">
            <div class="key" @mousedown="mouseKeyDown(keyNote)" @mouseup="mouseKeyUp(keyNote)" @mouseover="mouseOverKey($event, keyNote)" @mouseout="mouseOutKey($event, keyNote)">
              <span class="key-note">{{ keyNote.note }}<sub>{{ keyNote.octave }}</sub></span>
              <kbd>{{ keyNote.key }}</kbd>
            </div>
          </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Keyboard',
  props: {
    volume: Object,
    instruments: Array
  },
  data: function() {
    return {
        octave: 2,
        pressedKeys: [],
        showKeyMarks: true,
        showKeyNotes: true
    }
  },
  computed: {
    volumeModel: {
      get: function() {
        if(this.volume === null) {
          return 0;
        }
        return this.volume.gain.value
      },
      set: function(volume) {
        if(this.volume === null) {
          return;
        }
        this.volume.gain.value = volume;
      }
    },
    selectedInstrument(){
      for(let i=0, length = this.instruments.length; i < length; i++) {
        if(this.instruments[i].active) {
          return i;
        }
      }
      return null;
    },
    keyNotes() {
      let keyNotes = [];
      let notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
      let blackKeys = ['C#', 'D#', 'F#', 'G#', 'A#'];
      let keys = [
        "q", //c
        "2", //c#
        "w", //d
        "3", //d#
        "e", //e
        "r", //f
        "5", //f#
        "t", //g
        "6", //g#
        "y", //a
        "7", //a#
        "u", //b
        "i", //c+1
        "9", //c#+1
        "o", //d+1
        "0", //d#+1
        "p", //e+1
        "z", //f+1
        "s", //f#+1
        "x", //g+1
        "d", //g#+1
        "c", //a+1
        "f", //a#+1
        "v", //b+1
        "b", //c+2
        "h", //c#+2
        "n", //d+2
        "j", //d#+2
        "m", //e+2
        ",", //f+2
        "l", //f#+2
        ".", //g+2
        ";", //g#+2
        '/', //a+2
        "'", //a#+2
        "shift", //b+2
      ];

      let keyIndex = 0;
      for(let i = 0; i < 3; i++) {
        let currentOctave = this.octave + i;

        for(let j = 0, jLength = notes.length; j < jLength; j++) {
          let black = false;
          let pressed = false;

          if(blackKeys.indexOf(notes[j]) > -1) {
            black = true;
          }

          if(this.pressedKeys.indexOf(keys[keyIndex]) >= 0) {
            pressed = true;
          }

          keyNotes.push({
            note: notes[j],
            octave: currentOctave,
            black: black,
            key: keys[keyIndex],
            pressed: pressed
          });

          keyIndex++;
        }
      }

      return keyNotes;
    }
  },
  methods: {
    //raise octaves
    octaveDown() {
      if(this.octave < 0)
        return;

      this.octave -= 1;
    },
    //lower octaves
    octaveUp() {
      if(this.octave > 7)
        return;

      this.octave += 1;
    },
    //keyboard controls
    keyDown(event) {
      let inputTypes = [
        'input',
        'textarea',
        'text',
        'password',
        'email',
        'number',
        'url',
        'tel',
        'date',
        `time`,
        'range',
        'color',
        'checkbox',
        'radio'
      ];
      let key = event.key.toLowerCase();

      if(inputTypes.indexOf(event.target.type) >= 0) {
        return;
      }

      if(this.pressedKeys.indexOf(key) >= 0) {
        return;
      }

      this.pressedKeys.push(key);

      let note = this.keyToNote(key);
      if(note) {
        this.$emit('keyDown', note);
      }
    },
    //keyboard controls
    keyUp(event) {
      let key = event.key.toLowerCase();
      let keyPressedIndex = this.pressedKeys.indexOf(key);
      if(keyPressedIndex < 0) {
        return;
      }

      this.pressedKeys.splice(keyPressedIndex);

      let note = this.keyToNote(key);
      this.$emit('keyUp', note);
    },
    //find note assigned to key
    keyToNote(key) {
      let note = false;

      for(let keyNote of this.keyNotes) {
        if(keyNote.key == key) {
          note = {
            note: keyNote.note,
            octave: keyNote.octave
          };
          break;
        }
      }

      return note;
    },
    //click key
    mouseKeyDown(keyNote) {
      if(this.pressedKeys.indexOf(keyNote.key) >= 0) {
        return;
      }

      this.pressedKeys.push(keyNote.key);
      this.$emit('keyDown', {
        note: keyNote.note,
        octave: keyNote.octave
      });
    },
    //click key end
    mouseKeyUp(keyNote) {
      let keyPressedIndex = this.pressedKeys.indexOf(keyNote.key);
      if(keyPressedIndex < 0) {
        return;
      }

      this.pressedKeys.splice(keyPressedIndex);
      this.$emit('keyUp', {
        note: keyNote.note,
        octave: keyNote.octave
      });
    },
    //mouse enter key while mouse button is pressed
    mouseOverKey(event, keyNote) {
      if(event.buttons !== 1 && event.buttons !== 3) {
        return;
      }

      if(this.pressedKeys.indexOf(keyNote.key) >= 0) {
        return;
      }

      this.pressedKeys.push(keyNote.key);
      this.$emit('keyDown', {
        note: keyNote.note,
        octave: keyNote.octave
      });
    },
    //mouse leave key while mouse button is pressed
    mouseOutKey(event, keyNote) {
      if(event.buttons !== 1 && event.buttons !== 3) {
        return;
      }

      let keyPressedIndex = this.pressedKeys.indexOf(keyNote.key);
      if(keyPressedIndex < 0) {
        return;
      }

      this.pressedKeys.splice(keyPressedIndex);
      this.$emit('keyUp', {
        note: keyNote.note,
        octave: keyNote.octave
      });
    },
    //select instrument
    selectInstrument(index) {
      for(let i=0, length = this.instruments.length; i < length; i++) { 
        if(i == index) {
          this.instruments[i].active = true;
        }
        else {
          this.instruments[i].active = false;
        }
      }
    }

  },
  mounted: function() {
    window.addEventListener('keydown', this.keyDown);
    window.addEventListener('keyup', this.keyUp);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .keyboard {display: flex; height: 300px; user-select: none;}
  .keyboard .key-container {display: flex; flex-grow:1; padding: 0 1px;}
  .keyboard .key {min-width: 30px; flex-grow:1; border:1px solid #dee2e6; border-top:none; border-radius:0 0 4px 4px; background: #fff; text-align: center; position: relative; cursor: pointer;}
  .keyboard .key .key-note {display:block; width: 100%; font-size: 0.8rem; position:absolute; bottom: 30px; opacity: 1; transition: .15s all;}
  .keyboard.hide-key-notes .key .key-note {opacity: 0;}
  .keyboard .key kbd {font-size: 0.8rem; position: absolute; position: absolute; bottom: 60px; left: 50%; transform:translateX(-50%); opacity: 1; transition: .15s;}
  .keyboard.hide-key-marks .key kbd {opacity: 0;}
  .keyboard .key-black {max-width: 0; width:0; border: none; padding: 0 0 100px; z-index:1;}
  .keyboard .key-black .key {background: black; color: #fff; transform: translateX(-50%);}
  .keyboard .pressed .key {background: #dee2e6;}
  .keyboard .pressed.key-black .key {background: #6c757d;}
</style>
