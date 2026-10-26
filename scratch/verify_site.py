import urllib.request

html = urllib.request.urlopen('http://localhost:8080/').read().decode('utf-8')

png_imgs = [
    'element_capcut.png', 'element_instagram.png', 'element_keyboard.png',
    'element_canva.png', 'element_drums.png', 'element_guitar.png',
    'about_editing.png', 'about_music.png', 'about_studio.png', 'about_design.png',
    'jan_logo_transparent.png',
    'contact_email.png', 'contact_instagram.png', 'contact_whatsapp.png'
]

print("=== CHECKING PNG IMAGE REFERENCES IN INDEX.HTML ===")
all_pngs_ok = True
for img in png_imgs:
    found = img in html
    print(f"{img}: {'FOUND IN HTML' if found else 'NOT FOUND'}")
    if not found:
        all_pngs_ok = False

print("\n=== CHECKING VIDEO CARDS IN INDEX.HTML ===")
all_videos_ok = True
for i in range(1, 9):
    pid = f"0{i}"
    found = f'data-project-id="{pid}"' in html
    print(f"Video Card {pid}: {'FOUND IN HTML' if found else 'NOT FOUND'}")
    if not found:
        all_videos_ok = False

print("\n=== SUMMARY ===")
print(f"PNG Assets Check: {'SUCCESS' if all_pngs_ok else 'FAILED'}")
print(f"Video Cards Check: {'SUCCESS' if all_videos_ok else 'FAILED'}")
