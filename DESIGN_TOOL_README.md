# 🎨 Mehaal Design Configuration Tool

## Overview
Ye ek simple GUI tool hai jo aapko Mehaal SaaS ki design ko easily configure karne main madad karta hai. Is tool ka istemal karke aap:

1. **Logo** change kar sakte hain
2. **Colors** (Light & Dark mode) customize kar sakte hain  
3. **Fonts** select kar sakte hain
4. **Layout** (Sidebar/Header) adjust kar sakte hain

## Requirements
- Python 3.7 ya usse upar
- Tkinter (Python ke saath built-in aata hai)

## Installation

### Windows
```bash
# Tool run karne ke liye sirf ye command chalayein:
run_design_tool.bat
```

### Mac/Linux
```bash
# Python se directly run karen:
python3 design_config_tool.py
```

## Features

### 1. 🎨 Logo Tab
- **SVG File Load**: Apni SVG file browse karke load karen
- **Logo Name**: Apne SaaS ka naam change karen
- **Preview**: SVG code edit kar sakte hain
- **Apply**: Logo component automatically create hota hai

### 2. 🎨 Colors Tab
- **Color Picker**: Har color ke liye visual color picker
- **HSL Format**: Colors HSL format main save hote hain (Tailwind ke liye best)
- **Light & Dark Mode**: Dono modes ke liye alag colors
- **Hex/RGB/Name Support**: Color picker automatically convert karta hai

### 3. 📝 Fonts Tab
- **Google Fonts**: Popular Google Fonts ki list
- **Body Font**: Main text ke liye font
- **Heading Font**: Headings ke liye font
- **Auto Configuration**: layout.tsx aur tailwind.config automatically update ho jati hain

### 4. 📐 Layout Tab
- **Sidebar Width**: w-48, w-56, w-64, etc.
- **Sidebar Position**: Left ya Right
- **Header Height**: h-12, h-16, h-20, etc.
- **Show/Hide Header**: Checkbox se control karen

## Usage Flow

1. **Tool Start Karen**
   ```bash
   run_design_tool.bat
   ```

2. **Logo Setup**
   - Logo tab main jayen
   - "Load SVG File" button click karen
   - Apni SVG file select karen
   - SaaS name change karen
   - "Apply Logo" click karen

3. **Colors Setup**
   - Colors tab main jayen
   - Har color ke liye "Pick Color" click karen
   - Color chooser se color select karen (ya HSL manually type karen)
   - "Apply Colors" click karen

4. **Fonts Setup**
   - Fonts tab main jayen
   - Body aur Heading fonts dropdown se select karen
   - "Apply Fonts" click karen

5. **Layout Setup**
   - Layout tab main jayen
   - Sidebar width, position select karen
   - Header height set karen
   - "Apply Layout" click karen

## File Paths

Tool ye files automatically create/update karta hai:

- `apps/web/components/ui/logo.tsx` - Logo component
- `apps/web/app/globals.css` - Color variables
- `apps/web/app/layout.tsx` - Font configuration
- `apps/web/app/(dashboards)/layout.tsx` - Dashboard layout

## Color Picker Tips

1. **Hex Code se**: Color picker main hex code paste karen (#FF5733)
2. **Color Name se**: Common colors ka naam bhi kaam karta hai (red, blue, etc.)
3. **HSL Directly**: Manual entry field main HSL type karen (221.2 83.2% 53.3%)

## Troubleshooting

### Problem: "Python not found"
**Solution**: Python install karen from https://www.python.org/

### Problem: "Tkinter not found"
**Solution**: 
- Windows: Python reinstall karen with "tcl/tk" option checked
- Mac: `brew install python-tk`
- Linux: `sudo apt-get install python3-tk`

### Problem: File paths not working
**Solution**: Tool ko Mehaal folder ke andar se hi run karen

## Advanced Usage

### Custom Paths
Har tab main file paths ko manually edit kar sakte hain agar aapka project structure different hai.

### Direct File Edit
Tool sirf helper hai - aap chahein to files directly bhi edit kar sakte hain. Tool bas convenience provide karta hai.

## Examples

### Color Format Examples
```
HSL: 221.2 83.2% 53.3%
Hex: #3B82F6 → Converts to HSL
RGB: (59, 130, 246) → Converts to HSL
```

### Font Name Examples
```
Sans Fonts: Inter, Roboto, Open Sans
Heading Fonts: Space_Grotesk, Outfit, Plus_Jakarta_Sans
```

### Layout Class Examples
```
Sidebar: w-48, w-56, w-64, w-72, w-80
Header: h-12, h-14, h-16, h-20, h-24
```

## Support

Agar koi issue ho to:
1. Check karen ke Python properly installed hai
2. Tool ko root folder (Mehaal) se run karen
3. File paths check karen ke wo sahi hain

## Credits

Developed for Mehaal 4.0 SaaS Architecture
Made with ❤️ using Python & Tkinter
