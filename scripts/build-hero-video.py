"""
Builds the looping hero video (hero.mp4 + hero.webm + poster) from the intro clip.
Usage:  python3 scripts/build-hero-video.py path/to/intro.mp4
Needs: ffmpeg.  The full 16:9 frame is kept (no crop) so it lines up with assets/hero/reveal.jpg.

IMPORTANT: the source clip ends with the last word ("...application", lips move strongly until ~9.35 s) followed by a
faint stray murmur (9.4-9.7 s) that must not be heard. Everything after VOICE_END is cut.
If you still hear an extra sound at the end, LOWER VOICE_END; if the last word is clipped, RAISE it (e.g. 9.50).
Check your own clip with an audio envelope before changing the numbers below.

Loop design (no repeated words):
  * AUDIO is played exactly as recorded (only 20 ms fades at the very ends). The voice starts after
    ~0.2 s and ends ~0.3 s before the clip finishes, so the loop point falls in natural silence.
  * VIDEO: during the final SEAM seconds (she is silent) the picture cross-fades into the very
    first frame, so the restart is invisible. Nothing is stretched or retimed -> lips stay in sync.
"""
import subprocess, sys, os

SRC = sys.argv[1]
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets", "hero")
TMP = "/tmp/hero_build"; os.makedirs(TMP, exist_ok=True); os.makedirs(OUT, exist_ok=True)
VOICE_END = 9.50
END = 9.65
SEAM = 0.15                     # seconds of picture cross-fade at the very end (voice is silent by then)
SCALE = "scale=1280:720:flags=lanczos"   # FULL frame (the scratch-reveal needs the whole 16:9 picture)
WHITE = "colorlevels=rimax=0.90:gimax=0.90:bimax=0.90"   # backdrop -> pure white
VF = f"{SCALE},{WHITE},fps=24,format=yuv420p"

def run(*a): subprocess.run(a, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
def probe(p, entry, sel="v:0"):
    return float(subprocess.check_output(["ffprobe","-v","error","-select_streams",sel,"-show_entries",f"stream={entry}","-of","csv=p=0",p]).decode().split()[0])

T = END                                                   # loop length in seconds
clean = f"{TMP}/clean.mp4"
run("ffmpeg","-y","-i",SRC,"-t",str(END),"-an","-vf",VF,"-c:v","libx264","-crf","12","-preset","fast",clean)
run("ffmpeg","-y","-i",clean,"-frames:v","1",f"{TMP}/first.png")

# video: last SEAM seconds dissolve into frame 0
loop = f"{TMP}/loop.mp4"
run("ffmpeg","-y","-i",clean,"-loop","1","-framerate","24","-t",str(SEAM),"-i",f"{TMP}/first.png",
    "-filter_complex",f"[0:v]settb=AVTB,setpts=PTS-STARTPTS[a];[1:v]fps=24,format=yuv420p,settb=AVTB,setpts=PTS-STARTPTS[b];"
    f"[a][b]xfade=transition=fade:duration={SEAM}:offset={T-SEAM:.3f},format=yuv420p[v]",
    "-map","[v]","-c:v","libx264","-crf","12","-preset","fast",loop)

# audio: untouched, tiny fades so there is never a click at the loop point
wav = f"{TMP}/a.wav"
run("ffmpeg","-y","-i",SRC,"-vn","-af",
    f"atrim=end={VOICE_END:.3f},afade=t=in:d=0.02,afade=t=out:st={VOICE_END-0.04:.3f}:d=0.04,apad=whole_dur={END:.3f}",
    "-t",f"{END:.3f}","-c:a","pcm_s16le",wav)

run("ffmpeg","-y","-i",loop,"-i",wav,"-map","0:v","-map","1:a","-t",f"{END:.3f}","-c:v","libx264","-crf","24","-preset","slow",
    "-pix_fmt","yuv420p","-c:a","aac","-b:a","96k","-movflags","+faststart",f"{OUT}/hero.mp4")
run("ffmpeg","-y","-i",loop,"-i",wav,"-map","0:v","-map","1:a","-t",f"{END:.3f}","-c:v","libvpx-vp9","-crf","34","-b:v","0",
    "-c:a","libopus","-b:a","80k",f"{OUT}/hero.webm")
run("ffmpeg","-y","-ss","0","-i",clean,"-frames:v","1","-q:v","3",f"{OUT}/poster.jpg")
print("done", sorted(os.listdir(OUT)))
