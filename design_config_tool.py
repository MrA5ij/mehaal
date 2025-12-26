"""
Design Configuration Tool for Mehaal SaaS
Ye tool aapko GUI main design changes apply karne main madad karega
"""

import tkinter as tk
from tkinter import ttk, filedialog, colorchooser, messagebox, scrolledtext
import os
import shutil
import re
from pathlib import Path

class DesignConfigTool:
    def __init__(self, root):
        self.root = root
        self.root.title("Mehaal Design Configuration Tool")
        self.root.geometry("900x700")
        
        # Base path - automatically detect project root
        self.base_path = Path(__file__).parent
        
        # Create notebook for tabs
        self.notebook = ttk.Notebook(root)
        self.notebook.pack(fill='both', expand=True, padx=10, pady=10)
        
        # Create tabs
        self.create_logo_tab()
        self.create_colors_tab()
        self.create_fonts_tab()
        self.create_layout_tab()
        
        # Status bar
        self.status_bar = tk.Label(root, text="Ready", bd=1, relief=tk.SUNKEN, anchor=tk.W)
        self.status_bar.pack(side=tk.BOTTOM, fill=tk.X)
    
    def create_logo_tab(self):
        """Logo configuration tab"""
        frame = ttk.Frame(self.notebook)
        self.notebook.add(frame, text="🎨 Logo")
        
        # Instructions
        ttk.Label(frame, text="Logo Setup (SVG recommended)", 
                 font=('Arial', 14, 'bold')).pack(pady=10)
        
        # Target file path
        ttk.Label(frame, text="Target File:").pack(anchor='w', padx=20)
        self.logo_path = tk.StringVar(value="apps/web/components/ui/logo.tsx")
        ttk.Entry(frame, textvariable=self.logo_path, width=60).pack(padx=20, pady=5)
        
        # Logo name
        ttk.Label(frame, text="SaaS Name:").pack(anchor='w', padx=20, pady=(10,0))
        self.logo_name = tk.StringVar(value="MySaaS")
        ttk.Entry(frame, textvariable=self.logo_name, width=60).pack(padx=20, pady=5)
        
        # SVG Code
        ttk.Label(frame, text="SVG Code (paste your logo SVG):").pack(anchor='w', padx=20, pady=(10,0))
        self.svg_text = scrolledtext.ScrolledText(frame, height=15, width=80)
        self.svg_text.pack(padx=20, pady=5)
        
        # Default SVG
        default_svg = '''<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" rx="8" fill={theme === 'dark' ? '#fff' : '#000'} />
  <path d="M16 8L24 24H8L16 8Z" fill={theme === 'dark' ? '#000' : '#fff'} />
</svg>'''
        self.svg_text.insert('1.0', default_svg)
        
        # Buttons
        btn_frame = ttk.Frame(frame)
        btn_frame.pack(pady=10)
        ttk.Button(btn_frame, text="Load SVG File", 
                  command=self.load_svg_file).pack(side='left', padx=5)
        ttk.Button(btn_frame, text="Apply Logo", 
                  command=self.apply_logo, 
                  style='Accent.TButton').pack(side='left', padx=5)
    
    def create_colors_tab(self):
        """Colors configuration tab"""
        frame = ttk.Frame(self.notebook)
        self.notebook.add(frame, text="🎨 Colors")
        
        ttk.Label(frame, text="Color Palette Configuration", 
                 font=('Arial', 14, 'bold')).pack(pady=10)
        
        # Target file
        ttk.Label(frame, text="Target File:").pack(anchor='w', padx=20)
        self.colors_path = tk.StringVar(value="apps/web/app/globals.css")
        ttk.Entry(frame, textvariable=self.colors_path, width=60).pack(padx=20, pady=5)
        
        # Color entries
        self.colors = {}
        color_configs = [
            ("Primary Color (Light Mode)", "primary_light", "221.2 83.2% 53.3%"),
            ("Primary Color (Dark Mode)", "primary_dark", "217.2 91.2% 59.8%"),
            ("Background (Light)", "bg_light", "0 0% 100%"),
            ("Background (Dark)", "bg_dark", "222.2 84% 4.9%"),
            ("Foreground (Light)", "fg_light", "222.2 84% 4.9%"),
            ("Foreground (Dark)", "fg_dark", "210 40% 98%"),
            ("Neon Blue Accent", "neon_blue", "180 100% 50%"),
        ]
        
        for label, key, default in color_configs:
            self.create_color_row(frame, label, key, default)
        
        # Apply button
        ttk.Button(frame, text="Apply Colors", 
                  command=self.apply_colors,
                  style='Accent.TButton').pack(pady=20)
    
    def create_color_row(self, parent, label, key, default_value):
        """Create a color input row with picker"""
        row_frame = ttk.Frame(parent)
        row_frame.pack(fill='x', padx=20, pady=5)
        
        ttk.Label(row_frame, text=label, width=30).pack(side='left')
        
        var = tk.StringVar(value=default_value)
        self.colors[key] = var
        
        entry = ttk.Entry(row_frame, textvariable=var, width=30)
        entry.pack(side='left', padx=5)
        
        ttk.Button(row_frame, text="Pick Color", 
                  command=lambda: self.pick_color(var)).pack(side='left')
    
    def create_fonts_tab(self):
        """Fonts configuration tab"""
        frame = ttk.Frame(self.notebook)
        self.notebook.add(frame, text="📝 Fonts")
        
        ttk.Label(frame, text="Font Configuration", 
                 font=('Arial', 14, 'bold')).pack(pady=10)
        
        # Target files
        ttk.Label(frame, text="Layout File:").pack(anchor='w', padx=20)
        self.layout_path = tk.StringVar(value="apps/web/app/layout.tsx")
        ttk.Entry(frame, textvariable=self.layout_path, width=60).pack(padx=20, pady=5)
        
        ttk.Label(frame, text="Tailwind Config:").pack(anchor='w', padx=20, pady=(10,0))
        self.tailwind_path = tk.StringVar(value="apps/web/tailwind.config.ts")
        ttk.Entry(frame, textvariable=self.tailwind_path, width=60).pack(padx=20, pady=5)
        
        # Font selections
        ttk.Label(frame, text="\nGoogle Fonts Selection:", 
                 font=('Arial', 12, 'bold')).pack(anchor='w', padx=20, pady=(20,5))
        
        # Primary font
        ttk.Label(frame, text="Body Font (Sans):").pack(anchor='w', padx=20)
        self.font_sans = tk.StringVar(value="Inter")
        ttk.Combobox(frame, textvariable=self.font_sans, 
                    values=["Inter", "Roboto", "Open Sans", "Lato", "Poppins", "Montserrat"],
                    width=57).pack(padx=20, pady=5)
        
        # Heading font
        ttk.Label(frame, text="Heading Font:").pack(anchor='w', padx=20, pady=(10,0))
        self.font_heading = tk.StringVar(value="Space_Grotesk")
        ttk.Combobox(frame, textvariable=self.font_heading,
                    values=["Space_Grotesk", "Outfit", "Plus_Jakarta_Sans", "DM_Sans", "Sora"],
                    width=57).pack(padx=20, pady=5)
        
        ttk.Button(frame, text="Apply Fonts", 
                  command=self.apply_fonts,
                  style='Accent.TButton').pack(pady=20)
    
    def create_layout_tab(self):
        """Layout configuration tab"""
        frame = ttk.Frame(self.notebook)
        self.notebook.add(frame, text="📐 Layout")
        
        ttk.Label(frame, text="Dashboard Layout Settings", 
                 font=('Arial', 14, 'bold')).pack(pady=10)
        
        # Target file
        ttk.Label(frame, text="Dashboard Layout File:").pack(anchor='w', padx=20)
        self.dashboard_layout_path = tk.StringVar(value="apps/web/app/(dashboards)/layout.tsx")
        ttk.Entry(frame, textvariable=self.dashboard_layout_path, width=60).pack(padx=20, pady=5)
        
        # Sidebar settings
        ttk.Label(frame, text="\nSidebar Settings:", 
                 font=('Arial', 12, 'bold')).pack(anchor='w', padx=20, pady=(20,5))
        
        ttk.Label(frame, text="Sidebar Width (Tailwind class):").pack(anchor='w', padx=20)
        self.sidebar_width = tk.StringVar(value="w-64")
        ttk.Combobox(frame, textvariable=self.sidebar_width,
                    values=["w-48", "w-56", "w-64", "w-72", "w-80"],
                    width=57).pack(padx=20, pady=5)
        
        ttk.Label(frame, text="Sidebar Position:").pack(anchor='w', padx=20, pady=(10,0))
        self.sidebar_position = tk.StringVar(value="left")
        ttk.Combobox(frame, textvariable=self.sidebar_position,
                    values=["left", "right"],
                    width=57).pack(padx=20, pady=5)
        
        # Header settings
        ttk.Label(frame, text="\nHeader Settings:", 
                 font=('Arial', 12, 'bold')).pack(anchor='w', padx=20, pady=(20,5))
        
        ttk.Label(frame, text="Header Height (Tailwind class):").pack(anchor='w', padx=20)
        self.header_height = tk.StringVar(value="h-16")
        ttk.Combobox(frame, textvariable=self.header_height,
                    values=["h-12", "h-14", "h-16", "h-20", "h-24"],
                    width=57).pack(padx=20, pady=5)
        
        ttk.Label(frame, text="Show Header:").pack(anchor='w', padx=20, pady=(10,0))
        self.show_header = tk.BooleanVar(value=True)
        ttk.Checkbutton(frame, variable=self.show_header, text="Yes").pack(anchor='w', padx=40)
        
        ttk.Button(frame, text="Apply Layout", 
                  command=self.apply_layout,
                  style='Accent.TButton').pack(pady=20)
    
    # Helper Methods
    
    def load_svg_file(self):
        """Load SVG file from file picker"""
        file_path = filedialog.askopenfilename(
            title="Select SVG File",
            filetypes=[("SVG files", "*.svg"), ("All files", "*.*")]
        )
        if file_path:
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    svg_content = f.read()
                self.svg_text.delete('1.0', tk.END)
                self.svg_text.insert('1.0', svg_content)
                self.status_bar.config(text=f"Loaded: {file_path}")
            except Exception as e:
                messagebox.showerror("Error", f"Failed to load SVG: {str(e)}")
    
    def pick_color(self, var):
        """Open color picker and convert to HSL"""
        color = colorchooser.askcolor(title="Choose Color")
        if color[0]:  # RGB tuple
            r, g, b = [x/255.0 for x in color[0]]
            h, s, l = self.rgb_to_hsl(r, g, b)
            hsl_string = f"{h:.1f} {s:.1f}% {l:.1f}%"
            var.set(hsl_string)
            self.status_bar.config(text=f"Color selected: {color[1]} → {hsl_string}")
    
    def rgb_to_hsl(self, r, g, b):
        """Convert RGB to HSL"""
        max_c = max(r, g, b)
        min_c = min(r, g, b)
        l = (max_c + min_c) / 2
        
        if max_c == min_c:
            h = s = 0
        else:
            d = max_c - min_c
            s = d / (2 - max_c - min_c) if l > 0.5 else d / (max_c + min_c)
            
            if max_c == r:
                h = (g - b) / d + (6 if g < b else 0)
            elif max_c == g:
                h = (b - r) / d + 2
            else:
                h = (r - g) / d + 4
            h /= 6
        
        return (h * 360, s * 100, l * 100)
    
    def get_full_path(self, relative_path):
        """Get full path from relative path"""
        return self.base_path / relative_path
    
    # Apply Methods
    
    def apply_logo(self):
        """Apply logo configuration"""
        try:
            target_path = self.get_full_path(self.logo_path.get())
            target_path.parent.mkdir(parents=True, exist_ok=True)
            
            svg_code = self.svg_text.get('1.0', tk.END).strip()
            logo_name = self.logo_name.get()
            
            logo_content = f"""// File: {self.logo_path.get()}
import Image from 'next/image';

export const Logo = ({{ className, theme = 'dark' }}: {{ className?: string, theme?: 'dark' | 'light' }}) => {{
  return (
    <div className={{`font-bold text-xl flex items-center gap-2 ${{className}}`}}>
      {svg_code}
      <span>{logo_name}</span>
    </div>
  );
}};
"""
            
            with open(target_path, 'w', encoding='utf-8') as f:
                f.write(logo_content)
            
            messagebox.showinfo("Success", f"Logo applied successfully!\n{target_path}")
            self.status_bar.config(text=f"✓ Logo file created: {target_path}")
        
        except Exception as e:
            messagebox.showerror("Error", f"Failed to apply logo: {str(e)}")
            self.status_bar.config(text=f"✗ Error: {str(e)}")
    
    def apply_colors(self):
        """Apply color configuration to globals.css"""
        try:
            target_path = self.get_full_path(self.colors_path.get())
            target_path.parent.mkdir(parents=True, exist_ok=True)
            
            css_content = f"""/* File: {self.colors_path.get()} */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {{
  :root {{
    /* --- LIGHT MODE COLORS --- */
    --background: {self.colors['bg_light'].get()};
    --foreground: {self.colors['fg_light'].get()};
    
    /* BRAND COLOR */
    --primary: {self.colors['primary_light'].get()};
    --primary-foreground: 210 40% 98%;
    
    /* AI/Neon Accents */
    --neon-blue: {self.colors['neon_blue'].get()};
    
    /* Supporting Colors */
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --border: 214.3 31.8% 91.4%;
    --glass: rgba(255, 255, 255, 0.05);
  }}
   
  .dark {{
    /* --- DARK MODE COLORS --- */
    --background: {self.colors['bg_dark'].get()};
    --foreground: {self.colors['fg_dark'].get()};
    
    /* Dark Mode Brand Color */
    --primary: {self.colors['primary_dark'].get()};
    --primary-foreground: 222.2 47.4% 11.2%;
    
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --border: 217.2 32.6% 17.5%;
    --glass: rgba(255, 255, 255, 0.05);
  }}
}}
"""
            
            with open(target_path, 'w', encoding='utf-8') as f:
                f.write(css_content)
            
            messagebox.showinfo("Success", f"Colors applied successfully!\n{target_path}")
            self.status_bar.config(text=f"✓ Colors updated: {target_path}")
        
        except Exception as e:
            messagebox.showerror("Error", f"Failed to apply colors: {str(e)}")
            self.status_bar.config(text=f"✗ Error: {str(e)}")
    
    def apply_fonts(self):
        """Apply font configuration"""
        try:
            # Update layout.tsx
            layout_path = self.get_full_path(self.layout_path.get())
            layout_path.parent.mkdir(parents=True, exist_ok=True)
            
            font_sans = self.font_sans.get()
            font_heading = self.font_heading.get()
            
            layout_content = f"""// File: {self.layout_path.get()}
import {{ {font_sans}, {font_heading} }} from 'next/font/google'
import './globals.css'
import {{ ThemeProvider }} from '@/components/theme-provider'

const fontSans = {font_sans}({{ subsets: ['latin'], variable: '--font-sans' }})
const fontHeading = {font_heading}({{ subsets: ['latin'], variable: '--font-heading' }})

export const metadata = {{
  title: 'Mehaal SaaS Platform',
  description: 'AI-Powered SaaS Solution',
}}

export default function RootLayout({{
  children,
}}: {{
  children: React.ReactNode
}}) {{
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={{`${{fontSans.variable}} ${{fontHeading.variable}} font-sans antialiased`}}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {{children}}
        </ThemeProvider>
      </body>
    </html>
  )
}}
"""
            
            with open(layout_path, 'w', encoding='utf-8') as f:
                f.write(layout_content)
            
            messagebox.showinfo("Success", f"Fonts applied successfully!\n{layout_path}")
            self.status_bar.config(text=f"✓ Fonts configured: {layout_path}")
        
        except Exception as e:
            messagebox.showerror("Error", f"Failed to apply fonts: {str(e)}")
            self.status_bar.config(text=f"✗ Error: {str(e)}")
    
    def apply_layout(self):
        """Apply layout configuration"""
        try:
            target_path = self.get_full_path(self.dashboard_layout_path.get())
            # Escape parentheses for the actual path
            actual_path = str(target_path).replace('(', '\\(').replace(')', '\\)')
            Path(actual_path).parent.mkdir(parents=True, exist_ok=True)
            
            sidebar_width = self.sidebar_width.get()
            sidebar_position = self.sidebar_position.get()
            header_height = self.header_height.get()
            show_header = self.show_header.get()
            
            # Create layout based on sidebar position
            if sidebar_position == "left":
                sidebar_order = "order-1"
                main_order = "order-2"
            else:
                sidebar_order = "order-2"
                main_order = "order-1"
            
            header_section = f"""        <header className="{header_height} border-b flex items-center px-6">
          <Logo />
        </header>""" if show_header else ""
            
            layout_content = f"""// File: {self.dashboard_layout_path.get()}
import {{ Logo }} from '@/components/ui/logo'

export default function DashboardLayout({{
  children,
}}: {{
  children: React.ReactNode
}}) {{
  return (
    <div className="flex h-screen bg-background">
      {{/* SIDEBAR */}}
      <aside className="{sidebar_width} border-r bg-glass backdrop-blur-sm {sidebar_order}">
        <div className="p-6">
          <Logo />
        </div>
        <nav className="px-4">
          {{/* Sidebar navigation items */}}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col {main_order}">
{header_section}
          
        <main className="flex-1 p-6 overflow-auto">
          {{children}}
        </main>
      </div>
    </div>
  )
}}
"""
            
            with open(actual_path, 'w', encoding='utf-8') as f:
                f.write(layout_content)
            
            messagebox.showinfo("Success", f"Layout applied successfully!\n{target_path}")
            self.status_bar.config(text=f"✓ Layout updated: {target_path}")
        
        except Exception as e:
            messagebox.showerror("Error", f"Failed to apply layout: {str(e)}")
            self.status_bar.config(text=f"✗ Error: {str(e)}")

def main():
    root = tk.Tk()
    app = DesignConfigTool(root)
    root.mainloop()

if __name__ == "__main__":
    main()
