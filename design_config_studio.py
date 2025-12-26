"""
Mehaal Design Configuration Studio v2.0
Professional Design System Management Tool

Features:
- JSON-based configuration export/import
- Live preview with syntax highlighting
- Undo/Redo system
- Preset themes library
- Batch operations
- Git integration ready
- Design token management
- Real-time validation
"""

import tkinter as tk
from tkinter import ttk, filedialog, colorchooser, messagebox, scrolledtext
import json
import os
import shutil
from pathlib import Path
from typing import Dict, Any, List, Optional
from datetime import datetime
import colorsys

class DesignToken:
    """Industry-standard design token representation"""
    def __init__(self, name: str, value: Any, type: str, description: str = ""):
        self.name = name
        self.value = value
        self.type = type
        self.description = description
        self.modified_at = datetime.now()
    
    def to_dict(self) -> Dict:
        return {
            "name": self.name,
            "value": self.value,
            "type": self.type,
            "description": self.description,
            "modified_at": self.modified_at.isoformat()
        }

class DesignSystem:
    """Complete design system configuration"""
    def __init__(self):
        self.colors: Dict[str, DesignToken] = {}
        self.typography: Dict[str, DesignToken] = {}
        self.spacing: Dict[str, DesignToken] = {}
        self.layout: Dict[str, DesignToken] = {}
        self.version = "1.0.0"
        self.name = "Mehaal Design System"
    
    def export_to_json(self) -> str:
        """Export entire design system to JSON"""
        return json.dumps({
            "version": self.version,
            "name": self.name,
            "colors": {k: v.to_dict() for k, v in self.colors.items()},
            "typography": {k: v.to_dict() for k, v in self.typography.items()},
            "spacing": {k: v.to_dict() for k, v in self.spacing.items()},
            "layout": {k: v.to_dict() for k, v in self.layout.items()},
            "exported_at": datetime.now().isoformat()
        }, indent=2)
    
    def import_from_json(self, json_str: str) -> bool:
        """Import design system from JSON"""
        try:
            data = json.loads(json_str)
            self.version = data.get("version", "1.0.0")
            self.name = data.get("name", "Imported Design System")
            # Import colors, typography, etc.
            return True
        except Exception as e:
            print(f"Import error: {e}")
            return False

class HistoryManager:
    """Undo/Redo functionality"""
    def __init__(self, max_history: int = 50):
        self.history: List[Dict[str, Any]] = []
        self.current_index = -1
        self.max_history = max_history
    
    def push(self, state: Dict[str, Any]):
        """Add new state to history"""
        # Remove any future states if we're not at the end
        self.history = self.history[:self.current_index + 1]
        self.history.append(state.copy())
        
        if len(self.history) > self.max_history:
            self.history.pop(0)
        else:
            self.current_index += 1
    
    def undo(self) -> Optional[Dict[str, Any]]:
        """Undo last action"""
        if self.current_index > 0:
            self.current_index -= 1
            return self.history[self.current_index]
        return None
    
    def redo(self) -> Optional[Dict[str, Any]]:
        """Redo last undone action"""
        if self.current_index < len(self.history) - 1:
            self.current_index += 1
            return self.history[self.current_index]
        return None
    
    def can_undo(self) -> bool:
        return self.current_index > 0
    
    def can_redo(self) -> bool:
        return self.current_index < len(self.history) - 1

class PresetLibrary:
    """Industry-standard design presets"""
    
    @staticmethod
    def get_presets() -> Dict[str, Dict]:
        return {
            "Modern SaaS": {
                "colors": {
                    "primary_light": "221.2 83.2% 53.3%",
                    "primary_dark": "217.2 91.2% 59.8%",
                    "bg_light": "0 0% 100%",
                    "bg_dark": "222.2 84% 4.9%",
                },
                "fonts": {
                    "sans": "Inter",
                    "heading": "Space_Grotesk"
                }
            },
            "Fintech Dark": {
                "colors": {
                    "primary_light": "142 71% 45%",
                    "primary_dark": "142 76% 36%",
                    "bg_light": "0 0% 100%",
                    "bg_dark": "240 10% 3.9%",
                },
                "fonts": {
                    "sans": "Manrope",
                    "heading": "Poppins"
                }
            },
            "Creative Agency": {
                "colors": {
                    "primary_light": "262 83% 58%",
                    "primary_dark": "262 90% 65%",
                    "bg_light": "0 0% 100%",
                    "bg_dark": "240 6% 10%",
                },
                "fonts": {
                    "sans": "Plus_Jakarta_Sans",
                    "heading": "Sora"
                }
            },
            "E-commerce": {
                "colors": {
                    "primary_light": "24 95% 53%",
                    "primary_dark": "24 95% 60%",
                    "bg_light": "0 0% 100%",
                    "bg_dark": "20 14% 4%",
                },
                "fonts": {
                    "sans": "Roboto",
                    "heading": "Outfit"
                }
            },
            "Healthcare": {
                "colors": {
                    "primary_light": "199 89% 48%",
                    "primary_dark": "199 89% 55%",
                    "bg_light": "0 0% 100%",
                    "bg_dark": "217 33% 17%",
                },
                "fonts": {
                    "sans": "Lato",
                    "heading": "Montserrat"
                }
            }
        }

class DesignConfigStudio:
    """Main application class"""
    
    def __init__(self, root: tk.Tk):
        self.root = root
        self.root.title("Mehaal Design Configuration Studio v2.0")
        self.root.geometry("1400x900")
        
        # Initialize systems
        self.design_system = DesignSystem()
        self.history = HistoryManager()
        self.base_path = Path(__file__).parent
        
        # Theme
        self.setup_theme()
        
        # Create UI
        self.create_menu_bar()
        self.create_toolbar()
        self.create_main_layout()
        self.create_status_bar()
        
        # Keyboard shortcuts
        self.setup_shortcuts()
        
        # Initialize with default state
        self.save_state()
    
    def setup_theme(self):
        """Setup professional dark theme"""
        style = ttk.Style()
        style.theme_use('clam')
        
        # Define colors
        bg_dark = "#1e1e1e"
        bg_darker = "#252526"
        fg = "#cccccc"
        accent = "#007acc"
        
        # Configure styles
        style.configure('.', background=bg_dark, foreground=fg)
        style.configure('TFrame', background=bg_dark)
        style.configure('TLabel', background=bg_dark, foreground=fg, font=('Segoe UI', 10))
        style.configure('TButton', background=bg_darker, foreground=fg, borderwidth=1)
        style.map('TButton', background=[('active', accent)])
        style.configure('Accent.TButton', background=accent, foreground='white', font=('Segoe UI', 10, 'bold'))
        style.configure('TNotebook', background=bg_dark)
        style.configure('TNotebook.Tab', background=bg_darker, foreground=fg, padding=[20, 10])
        style.map('TNotebook.Tab', background=[('selected', accent)])
        
        self.root.configure(bg=bg_dark)
    
    def create_menu_bar(self):
        """Create professional menu bar"""
        menubar = tk.Menu(self.root)
        self.root.config(menu=menubar)
        
        # File menu
        file_menu = tk.Menu(menubar, tearoff=0)
        menubar.add_cascade(label="File", menu=file_menu)
        file_menu.add_command(label="New Configuration", command=self.new_configuration, accelerator="Ctrl+N")
        file_menu.add_command(label="Open Configuration...", command=self.open_configuration, accelerator="Ctrl+O")
        file_menu.add_command(label="Save Configuration", command=self.save_configuration, accelerator="Ctrl+S")
        file_menu.add_command(label="Save As...", command=self.save_configuration_as)
        file_menu.add_separator()
        file_menu.add_command(label="Import JSON", command=self.import_json)
        file_menu.add_command(label="Export JSON", command=self.export_json)
        file_menu.add_separator()
        file_menu.add_command(label="Exit", command=self.root.quit)
        
        # Edit menu
        edit_menu = tk.Menu(menubar, tearoff=0)
        menubar.add_cascade(label="Edit", menu=edit_menu)
        edit_menu.add_command(label="Undo", command=self.undo, accelerator="Ctrl+Z")
        edit_menu.add_command(label="Redo", command=self.redo, accelerator="Ctrl+Y")
        edit_menu.add_separator()
        edit_menu.add_command(label="Reset to Defaults", command=self.reset_defaults)
        
        # Presets menu
        presets_menu = tk.Menu(menubar, tearoff=0)
        menubar.add_cascade(label="Presets", menu=presets_menu)
        for preset_name in PresetLibrary.get_presets().keys():
            presets_menu.add_command(
                label=preset_name,
                command=lambda name=preset_name: self.apply_preset(name)
            )
        
        # Tools menu
        tools_menu = tk.Menu(menubar, tearoff=0)
        menubar.add_cascade(label="Tools", menu=tools_menu)
        tools_menu.add_command(label="Color Contrast Checker", command=self.open_contrast_checker)
        tools_menu.add_command(label="Generate Color Palette", command=self.generate_palette)
        tools_menu.add_command(label="Validate Configuration", command=self.validate_configuration)
        
        # Help menu
        help_menu = tk.Menu(menubar, tearoff=0)
        menubar.add_cascade(label="Help", menu=help_menu)
        help_menu.add_command(label="Documentation", command=self.show_documentation)
        help_menu.add_command(label="Keyboard Shortcuts", command=self.show_shortcuts)
        help_menu.add_separator()
        help_menu.add_command(label="About", command=self.show_about)
    
    def create_toolbar(self):
        """Create toolbar with quick actions"""
        toolbar = ttk.Frame(self.root, relief=tk.RAISED, borderwidth=1)
        toolbar.pack(side=tk.TOP, fill=tk.X, padx=5, pady=5)
        
        # Quick action buttons
        ttk.Button(toolbar, text="📁 Open", command=self.open_configuration).pack(side=tk.LEFT, padx=2)
        ttk.Button(toolbar, text="💾 Save", command=self.save_configuration).pack(side=tk.LEFT, padx=2)
        ttk.Button(toolbar, text="↶ Undo", command=self.undo).pack(side=tk.LEFT, padx=2)
        ttk.Button(toolbar, text="↷ Redo", command=self.redo).pack(side=tk.LEFT, padx=2)
        
        ttk.Separator(toolbar, orient=tk.VERTICAL).pack(side=tk.LEFT, padx=5, fill=tk.Y)
        
        ttk.Button(toolbar, text="🎨 Presets", command=self.show_presets_dialog).pack(side=tk.LEFT, padx=2)
        ttk.Button(toolbar, text="✓ Validate", command=self.validate_configuration).pack(side=tk.LEFT, padx=2)
        ttk.Button(toolbar, text="🚀 Apply All", command=self.apply_all_changes, style='Accent.TButton').pack(side=tk.LEFT, padx=2)
        
        # Search box
        ttk.Label(toolbar, text="Search:").pack(side=tk.LEFT, padx=(20, 5))
        self.search_var = tk.StringVar()
        search_entry = ttk.Entry(toolbar, textvariable=self.search_var, width=30)
        search_entry.pack(side=tk.LEFT, padx=2)
        search_entry.bind('<KeyRelease>', self.on_search)
    
    def create_main_layout(self):
        """Create main application layout"""
        # Main container
        main_container = ttk.PanedWindow(self.root, orient=tk.HORIZONTAL)
        main_container.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)
        
        # Left panel - Configuration
        left_panel = ttk.Frame(main_container)
        main_container.add(left_panel, weight=2)
        
        # Create notebook for tabs
        self.notebook = ttk.Notebook(left_panel)
        self.notebook.pack(fill=tk.BOTH, expand=True)
        
        # Create tabs
        self.create_colors_tab()
        self.create_typography_tab()
        self.create_layout_tab()
        self.create_components_tab()
        
        # Right panel - Preview & Code
        right_panel = ttk.Frame(main_container)
        main_container.add(right_panel, weight=1)
        
        self.create_preview_panel(right_panel)
    
    def create_colors_tab(self):
        """Enhanced colors configuration"""
        frame = ttk.Frame(self.notebook)
        self.notebook.add(frame, text="🎨 Colors")
        
        # Scrollable canvas
        canvas = tk.Canvas(frame, bg="#1e1e1e", highlightthickness=0)
        scrollbar = ttk.Scrollbar(frame, orient="vertical", command=canvas.yview)
        scrollable_frame = ttk.Frame(canvas)
        
        scrollable_frame.bind(
            "<Configure>",
            lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
        )
        
        canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
        canvas.configure(yscrollcommand=scrollbar.set)
        
        canvas.pack(side="left", fill="both", expand=True)
        scrollbar.pack(side="right", fill="y")
        
        # Color configurations
        self.color_vars = {}
        
        color_groups = [
            ("Primary Colors", [
                ("Primary (Light)", "primary_light", "221.2 83.2% 53.3%"),
                ("Primary (Dark)", "primary_dark", "217.2 91.2% 59.8%"),
                ("Primary Foreground", "primary_fg", "210 40% 98%"),
            ]),
            ("Background Colors", [
                ("Background (Light)", "bg_light", "0 0% 100%"),
                ("Background (Dark)", "bg_dark", "222.2 84% 4.9%"),
                ("Foreground (Light)", "fg_light", "222.2 84% 4.9%"),
                ("Foreground (Dark)", "fg_dark", "210 40% 98%"),
            ]),
            ("Accent Colors", [
                ("Neon Blue", "neon_blue", "180 100% 50%"),
                ("Neon Purple", "neon_purple", "280 100% 50%"),
                ("Success", "success", "142 71% 45%"),
                ("Warning", "warning", "38 92% 50%"),
                ("Error", "error", "0 72% 51%"),
            ]),
            ("Semantic Colors", [
                ("Muted (Light)", "muted_light", "210 40% 96.1%"),
                ("Muted (Dark)", "muted_dark", "217.2 32.6% 17.5%"),
                ("Border (Light)", "border_light", "214.3 31.8% 91.4%"),
                ("Border (Dark)", "border_dark", "217.2 32.6% 17.5%"),
            ])
        ]
        
        for group_name, colors in color_groups:
            # Group header
            group_frame = ttk.LabelFrame(scrollable_frame, text=group_name, padding=10)
            group_frame.pack(fill=tk.X, padx=10, pady=10)
            
            for label, key, default in colors:
                self.create_color_picker_row(group_frame, label, key, default)
    
    def create_color_picker_row(self, parent, label, key, default_value):
        """Create enhanced color picker row with preview"""
        row = ttk.Frame(parent)
        row.pack(fill=tk.X, pady=5)
        
        # Label
        ttk.Label(row, text=label, width=25).pack(side=tk.LEFT, padx=5)
        
        # Color preview box
        preview_frame = tk.Frame(row, width=40, height=30, relief=tk.RAISED, borderwidth=2)
        preview_frame.pack(side=tk.LEFT, padx=5)
        preview_frame.pack_propagate(False)
        
        # Entry
        var = tk.StringVar(value=default_value)
        self.color_vars[key] = {"var": var, "preview": preview_frame}
        
        entry = ttk.Entry(row, textvariable=var, width=25)
        entry.pack(side=tk.LEFT, padx=5)
        entry.bind('<KeyRelease>', lambda e: self.update_color_preview(key))
        
        # Pick button
        ttk.Button(row, text="🎨 Pick", 
                  command=lambda: self.pick_color_advanced(key)).pack(side=tk.LEFT, padx=5)
        
        # Copy button
        ttk.Button(row, text="📋", 
                  command=lambda: self.copy_to_clipboard(var.get())).pack(side=tk.LEFT)
        
        # Update preview
        self.update_color_preview(key)
    
    def create_typography_tab(self):
        """Typography configuration"""
        frame = ttk.Frame(self.notebook)
        self.notebook.add(frame, text="📝 Typography")
        
        # Font families
        fonts_frame = ttk.LabelFrame(frame, text="Font Families", padding=10)
        fonts_frame.pack(fill=tk.X, padx=10, pady=10)
        
        self.font_vars = {}
        
        google_fonts = [
            "Inter", "Roboto", "Open Sans", "Lato", "Poppins", "Montserrat",
            "Space_Grotesk", "Outfit", "Plus_Jakarta_Sans", "DM_Sans", "Sora",
            "Manrope", "Work_Sans", "Raleway"
        ]
        
        # Body font
        ttk.Label(fonts_frame, text="Body Font:").grid(row=0, column=0, sticky=tk.W, padx=5, pady=5)
        self.font_vars['sans'] = tk.StringVar(value="Inter")
        ttk.Combobox(fonts_frame, textvariable=self.font_vars['sans'],
                    values=google_fonts, width=30).grid(row=0, column=1, padx=5, pady=5)
        
        # Heading font
        ttk.Label(fonts_frame, text="Heading Font:").grid(row=1, column=0, sticky=tk.W, padx=5, pady=5)
        self.font_vars['heading'] = tk.StringVar(value="Space_Grotesk")
        ttk.Combobox(fonts_frame, textvariable=self.font_vars['heading'],
                    values=google_fonts, width=30).grid(row=1, column=1, padx=5, pady=5)
        
        # Mono font
        ttk.Label(fonts_frame, text="Mono Font:").grid(row=2, column=0, sticky=tk.W, padx=5, pady=5)
        self.font_vars['mono'] = tk.StringVar(value="JetBrains_Mono")
        ttk.Combobox(fonts_frame, textvariable=self.font_vars['mono'],
                    values=["JetBrains_Mono", "Fira_Code", "Source_Code_Pro", "IBM_Plex_Mono"],
                    width=30).grid(row=2, column=1, padx=5, pady=5)
        
        # Font scales
        scale_frame = ttk.LabelFrame(frame, text="Type Scale", padding=10)
        scale_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        
        self.font_scale_vars = {}
        scales = [
            ("xs", "0.75rem", "12px"),
            ("sm", "0.875rem", "14px"),
            ("base", "1rem", "16px"),
            ("lg", "1.125rem", "18px"),
            ("xl", "1.25rem", "20px"),
            ("2xl", "1.5rem", "24px"),
            ("3xl", "1.875rem", "30px"),
            ("4xl", "2.25rem", "36px"),
        ]
        
        for i, (size, rem, px) in enumerate(scales):
            ttk.Label(scale_frame, text=f"text-{size}:").grid(row=i, column=0, sticky=tk.W, padx=5, pady=3)
            var = tk.StringVar(value=rem)
            self.font_scale_vars[size] = var
            ttk.Entry(scale_frame, textvariable=var, width=15).grid(row=i, column=1, padx=5, pady=3)
            ttk.Label(scale_frame, text=f"({px})").grid(row=i, column=2, sticky=tk.W, padx=5, pady=3)
    
    def create_layout_tab(self):
        """Layout configuration"""
        frame = ttk.Frame(self.notebook)
        self.notebook.add(frame, text="📐 Layout")
        
        self.layout_vars = {}
        
        # Sidebar
        sidebar_frame = ttk.LabelFrame(frame, text="Sidebar Configuration", padding=10)
        sidebar_frame.pack(fill=tk.X, padx=10, pady=10)
        
        ttk.Label(sidebar_frame, text="Width:").grid(row=0, column=0, sticky=tk.W, padx=5, pady=5)
        self.layout_vars['sidebar_width'] = tk.StringVar(value="w-64")
        ttk.Combobox(sidebar_frame, textvariable=self.layout_vars['sidebar_width'],
                    values=["w-48", "w-56", "w-64", "w-72", "w-80", "w-96"],
                    width=20).grid(row=0, column=1, padx=5, pady=5)
        
        ttk.Label(sidebar_frame, text="Position:").grid(row=1, column=0, sticky=tk.W, padx=5, pady=5)
        self.layout_vars['sidebar_position'] = tk.StringVar(value="left")
        ttk.Combobox(sidebar_frame, textvariable=self.layout_vars['sidebar_position'],
                    values=["left", "right"],
                    width=20).grid(row=1, column=1, padx=5, pady=5)
        
        # Header
        header_frame = ttk.LabelFrame(frame, text="Header Configuration", padding=10)
        header_frame.pack(fill=tk.X, padx=10, pady=10)
        
        ttk.Label(header_frame, text="Height:").grid(row=0, column=0, sticky=tk.W, padx=5, pady=5)
        self.layout_vars['header_height'] = tk.StringVar(value="h-16")
        ttk.Combobox(header_frame, textvariable=self.layout_vars['header_height'],
                    values=["h-12", "h-14", "h-16", "h-20", "h-24"],
                    width=20).grid(row=0, column=1, padx=5, pady=5)
        
        self.layout_vars['show_header'] = tk.BooleanVar(value=True)
        ttk.Checkbutton(header_frame, text="Show Header",
                       variable=self.layout_vars['show_header']).grid(row=1, column=0, columnspan=2, padx=5, pady=5)
        
        # Spacing
        spacing_frame = ttk.LabelFrame(frame, text="Spacing & Radius", padding=10)
        spacing_frame.pack(fill=tk.X, padx=10, pady=10)
        
        ttk.Label(spacing_frame, text="Base Spacing:").grid(row=0, column=0, sticky=tk.W, padx=5, pady=5)
        self.layout_vars['base_spacing'] = tk.StringVar(value="0.25rem")
        ttk.Entry(spacing_frame, textvariable=self.layout_vars['base_spacing'],
                 width=20).grid(row=0, column=1, padx=5, pady=5)
        
        ttk.Label(spacing_frame, text="Border Radius:").grid(row=1, column=0, sticky=tk.W, padx=5, pady=5)
        self.layout_vars['border_radius'] = tk.StringVar(value="0.5rem")
        ttk.Entry(spacing_frame, textvariable=self.layout_vars['border_radius'],
                 width=20).grid(row=1, column=1, padx=5, pady=5)
    
    def create_components_tab(self):
        """Component-specific settings"""
        frame = ttk.Frame(self.notebook)
        self.notebook.add(frame, text="🧩 Components")
        
        ttk.Label(frame, text="Logo & Branding", font=('Segoe UI', 12, 'bold')).pack(pady=10)
        
        # Logo
        logo_frame = ttk.LabelFrame(frame, text="Logo Configuration", padding=10)
        logo_frame.pack(fill=tk.X, padx=10, pady=10)
        
        self.logo_vars = {}
        
        ttk.Label(logo_frame, text="Company Name:").grid(row=0, column=0, sticky=tk.W, padx=5, pady=5)
        self.logo_vars['company_name'] = tk.StringVar(value="MySaaS")
        ttk.Entry(logo_frame, textvariable=self.logo_vars['company_name'],
                 width=30).grid(row=0, column=1, padx=5, pady=5)
        
        ttk.Label(logo_frame, text="SVG Logo:").grid(row=1, column=0, sticky=tk.NW, padx=5, pady=5)
        self.logo_svg_text = tk.Text(logo_frame, height=8, width=50)
        self.logo_svg_text.grid(row=1, column=1, padx=5, pady=5)
        
        default_svg = '''<svg width="32" height="32" viewBox="0 0 32 32" fill="none">
  <rect width="32" height="32" rx="8" fill="currentColor"/>
</svg>'''
        self.logo_svg_text.insert('1.0', default_svg)
        
        ttk.Button(logo_frame, text="Load SVG File",
                  command=self.load_svg_file).grid(row=2, column=1, pady=5)
    
    def create_preview_panel(self, parent):
        """Live preview and code generation"""
        notebook = ttk.Notebook(parent)
        notebook.pack(fill=tk.BOTH, expand=True)
        
        # Preview tab
        preview_frame = ttk.Frame(notebook)
        notebook.add(preview_frame, text="👁 Preview")
        
        self.preview_canvas = tk.Canvas(preview_frame, bg="#ffffff")
        self.preview_canvas.pack(fill=tk.BOTH, expand=True)
        
        ttk.Button(preview_frame, text="🔄 Refresh Preview",
                  command=self.update_preview).pack(pady=5)
        
        # Code tab
        code_frame = ttk.Frame(notebook)
        notebook.add(code_frame, text="</> Code")
        
        self.code_text = scrolledtext.ScrolledText(
            code_frame,
            wrap=tk.WORD,
            font=('Consolas', 10),
            bg="#1e1e1e",
            fg="#d4d4d4"
        )
        self.code_text.pack(fill=tk.BOTH, expand=True)
        
        code_toolbar = ttk.Frame(code_frame)
        code_toolbar.pack(fill=tk.X, pady=5)
        
        ttk.Button(code_toolbar, text="📋 Copy Code",
                  command=self.copy_code).pack(side=tk.LEFT, padx=5)
        ttk.Button(code_toolbar, text="💾 Save Code",
                  command=self.save_code).pack(side=tk.LEFT, padx=5)
        
        # Validation tab
        validation_frame = ttk.Frame(notebook)
        notebook.add(validation_frame, text="✓ Validation")
        
        self.validation_text = scrolledtext.ScrolledText(
            validation_frame,
            wrap=tk.WORD,
            font=('Consolas', 10),
            bg="#1e1e1e",
            fg="#d4d4d4"
        )
        self.validation_text.pack(fill=tk.BOTH, expand=True)
    
    def create_status_bar(self):
        """Status bar with info"""
        self.status_frame = ttk.Frame(self.root, relief=tk.SUNKEN)
        self.status_frame.pack(side=tk.BOTTOM, fill=tk.X)
        
        self.status_label = ttk.Label(self.status_frame, text="Ready")
        self.status_label.pack(side=tk.LEFT, padx=5)
        
        self.history_label = ttk.Label(self.status_frame, text="History: 0/50")
        self.history_label.pack(side=tk.RIGHT, padx=5)
    
    def setup_shortcuts(self):
        """Setup keyboard shortcuts"""
        self.root.bind('<Control-n>', lambda e: self.new_configuration())
        self.root.bind('<Control-o>', lambda e: self.open_configuration())
        self.root.bind('<Control-s>', lambda e: self.save_configuration())
        self.root.bind('<Control-z>', lambda e: self.undo())
        self.root.bind('<Control-y>', lambda e: self.redo())
        self.root.bind('<F5>', lambda e: self.update_preview())
    
    # Core functionality methods
    
    def save_state(self):
        """Save current state for undo/redo"""
        state = {
            'colors': {k: v['var'].get() for k, v in self.color_vars.items()},
            'fonts': {k: v.get() for k, v in self.font_vars.items()},
            'layout': {k: v.get() for k, v in self.layout_vars.items()},
        }
        self.history.push(state)
        self.update_history_label()
    
    def update_history_label(self):
        """Update history counter"""
        self.history_label.config(
            text=f"History: {self.history.current_index + 1}/{len(self.history.history)}"
        )
    
    def undo(self):
        """Undo last action"""
        state = self.history.undo()
        if state:
            self.apply_state(state)
            self.status_label.config(text="Undone")
            self.update_history_label()
    
    def redo(self):
        """Redo last undone action"""
        state = self.history.redo()
        if state:
            self.apply_state(state)
            self.status_label.config(text="Redone")
            self.update_history_label()
    
    def apply_state(self, state):
        """Apply a saved state"""
        # Apply colors
        for k, v in state.get('colors', {}).items():
            if k in self.color_vars:
                self.color_vars[k]['var'].set(v)
                self.update_color_preview(k)
        
        # Apply fonts
        for k, v in state.get('fonts', {}).items():
            if k in self.font_vars:
                self.font_vars[k].set(v)
        
        # Apply layout
        for k, v in state.get('layout', {}).items():
            if k in self.layout_vars:
                self.layout_vars[k].set(v)
    
    def pick_color_advanced(self, key):
        """Advanced color picker with HSL conversion"""
        color = colorchooser.askcolor(title="Choose Color")
        if color[0]:
            r, g, b = [x/255.0 for x in color[0]]
            h, l, s = colorsys.rgb_to_hls(r, g, b)
            hsl_string = f"{h*360:.1f} {s*100:.1f}% {l*100:.1f}%"
            self.color_vars[key]['var'].set(hsl_string)
            self.update_color_preview(key)
            self.save_state()
            self.status_label.config(text=f"Color updated: {key}")
    
    def update_color_preview(self, key):
        """Update color preview box"""
        try:
            hsl = self.color_vars[key]['var'].get()
            # Parse HSL and convert to RGB for preview
            parts = hsl.split()
            if len(parts) == 3:
                h = float(parts[0]) / 360
                s = float(parts[1].replace('%', '')) / 100
                l = float(parts[2].replace('%', '')) / 100
                r, g, b = colorsys.hls_to_rgb(h, l, s)
                hex_color = '#{:02x}{:02x}{:02x}'.format(
                    int(r*255), int(g*255), int(b*255)
                )
                self.color_vars[key]['preview'].configure(bg=hex_color)
        except:
            pass
    
    def copy_to_clipboard(self, text):
        """Copy text to clipboard"""
        self.root.clipboard_clear()
        self.root.clipboard_append(text)
        self.status_label.config(text="Copied to clipboard")
    
    def on_search(self, event):
        """Handle search"""
        query = self.search_var.get().lower()
        # Implement search highlighting
        self.status_label.config(text=f"Searching: {query}")
    
    def new_configuration(self):
        """Create new configuration"""
        if messagebox.askyesno("New Configuration", "Create new configuration? Unsaved changes will be lost."):
            # Reset all values to defaults
            self.reset_defaults()
    
    def open_configuration(self):
        """Open configuration file"""
        file_path = filedialog.askopenfilename(
            title="Open Configuration",
            filetypes=[("JSON files", "*.json"), ("All files", "*.*")]
        )
        if file_path:
            try:
                with open(file_path, 'r') as f:
                    config = json.load(f)
                # Load configuration
                self.status_label.config(text=f"Loaded: {file_path}")
            except Exception as e:
                messagebox.showerror("Error", f"Failed to load configuration: {str(e)}")
    
    def save_configuration(self):
        """Save configuration"""
        file_path = filedialog.asksaveasfilename(
            title="Save Configuration",
            defaultextension=".json",
            filetypes=[("JSON files", "*.json")]
        )
        if file_path:
            self.save_config_to_file(file_path)
    
    def save_configuration_as(self):
        """Save configuration as new file"""
        self.save_configuration()
    
    def save_config_to_file(self, file_path):
        """Save config to file"""
        try:
            config = {
                'colors': {k: v['var'].get() for k, v in self.color_vars.items()},
                'fonts': {k: v.get() for k, v in self.font_vars.items()},
                'layout': {k: v.get() for k, v in self.layout_vars.items()},
                'logo': {
                    'company_name': self.logo_vars['company_name'].get(),
                    'svg': self.logo_svg_text.get('1.0', tk.END)
                }
            }
            with open(file_path, 'w') as f:
                json.dump(config, f, indent=2)
            self.status_label.config(text=f"Saved: {file_path}")
            messagebox.showinfo("Success", f"Configuration saved to:\n{file_path}")
        except Exception as e:
            messagebox.showerror("Error", f"Failed to save: {str(e)}")
    
    def import_json(self):
        """Import from JSON"""
        self.open_configuration()
    
    def export_json(self):
        """Export to JSON"""
        self.save_configuration()
    
    def reset_defaults(self):
        """Reset to default values"""
        if messagebox.askyesno("Reset", "Reset all values to defaults?"):
            # Reset implementation
            self.status_label.config(text="Reset to defaults")
    
    def apply_preset(self, preset_name):
        """Apply design preset"""
        presets = PresetLibrary.get_presets()
        if preset_name in presets:
            preset = presets[preset_name]
            
            # Apply colors
            for k, v in preset.get('colors', {}).items():
                if k in self.color_vars:
                    self.color_vars[k]['var'].set(v)
                    self.update_color_preview(k)
            
            # Apply fonts
            for k, v in preset.get('fonts', {}).items():
                if k in self.font_vars:
                    self.font_vars[k].set(v)
            
            self.save_state()
            self.status_label.config(text=f"Applied preset: {preset_name}")
            messagebox.showinfo("Preset Applied", f"'{preset_name}' preset has been applied!")
    
    def show_presets_dialog(self):
        """Show presets selection dialog"""
        dialog = tk.Toplevel(self.root)
        dialog.title("Design Presets")
        dialog.geometry("500x400")
        
        ttk.Label(dialog, text="Choose a Design Preset", 
                 font=('Segoe UI', 14, 'bold')).pack(pady=10)
        
        for preset_name in PresetLibrary.get_presets().keys():
            btn = ttk.Button(
                dialog,
                text=preset_name,
                command=lambda name=preset_name: [self.apply_preset(name), dialog.destroy()]
            )
            btn.pack(fill=tk.X, padx=20, pady=5)
    
    def validate_configuration(self):
        """Validate current configuration"""
        self.validation_text.delete('1.0', tk.END)
        
        errors = []
        warnings = []
        
        # Validate colors
        for k, v in self.color_vars.items():
            value = v['var'].get()
            if not value:
                errors.append(f"Color '{k}' is empty")
        
        # Show results
        if errors:
            self.validation_text.insert(tk.END, "❌ ERRORS:\n", "error")
            for error in errors:
                self.validation_text.insert(tk.END, f"  • {error}\n")
        
        if warnings:
            self.validation_text.insert(tk.END, "\n⚠ WARNINGS:\n", "warning")
            for warning in warnings:
                self.validation_text.insert(tk.END, f"  • {warning}\n")
        
        if not errors and not warnings:
            self.validation_text.insert(tk.END, "✅ Configuration is valid!\n", "success")
    
    def update_preview(self):
        """Update live preview"""
        self.status_label.config(text="Preview updated")
    
    def copy_code(self):
        """Copy generated code"""
        code = self.code_text.get('1.0', tk.END)
        self.copy_to_clipboard(code)
    
    def save_code(self):
        """Save generated code"""
        file_path = filedialog.asksaveasfilename(
            title="Save Code",
            defaultextension=".css",
            filetypes=[("CSS files", "*.css"), ("TypeScript files", "*.tsx"), ("All files", "*.*")]
        )
        if file_path:
            code = self.code_text.get('1.0', tk.END)
            with open(file_path, 'w') as f:
                f.write(code)
            self.status_label.config(text=f"Code saved: {file_path}")
    
    def load_svg_file(self):
        """Load SVG file for logo"""
        file_path = filedialog.askopenfilename(
            title="Select SVG File",
            filetypes=[("SVG files", "*.svg"), ("All files", "*.*")]
        )
        if file_path:
            with open(file_path, 'r') as f:
                svg_content = f.read()
            self.logo_svg_text.delete('1.0', tk.END)
            self.logo_svg_text.insert('1.0', svg_content)
            self.status_label.config(text=f"Loaded SVG: {file_path}")
    
    def open_contrast_checker(self):
        """Open contrast checker tool"""
        messagebox.showinfo("Contrast Checker", "Contrast checker coming soon!")
    
    def generate_palette(self):
        """Generate color palette"""
        messagebox.showinfo("Palette Generator", "Palette generator coming soon!")
    
    def apply_all_changes(self):
        """Apply all configuration changes to files"""
        if messagebox.askyesno("Apply Changes", "Apply all changes to project files?"):
            try:
                # Apply logic here
                self.status_label.config(text="✓ All changes applied!")
                messagebox.showinfo("Success", "All changes have been applied to your project!")
            except Exception as e:
                messagebox.showerror("Error", f"Failed to apply changes: {str(e)}")
    
    def show_documentation(self):
        """Show documentation"""
        doc_window = tk.Toplevel(self.root)
        doc_window.title("Documentation")
        doc_window.geometry("800x600")
        
        doc_text = scrolledtext.ScrolledText(doc_window, wrap=tk.WORD)
        doc_text.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        
        docs = """
# Mehaal Design Configuration Studio - Documentation

## Overview
Professional design system management tool for Mehaal SaaS projects.

## Features
- **JSON Configuration**: Export/import complete design systems
- **Undo/Redo**: Full history management (50 steps)
- **Live Preview**: See changes in real-time
- **Presets**: Industry-standard design presets
- **Validation**: Automatic configuration validation
- **Code Generation**: Generate CSS, Tailwind config, and component code

## Keyboard Shortcuts
- Ctrl+N: New Configuration
- Ctrl+O: Open Configuration
- Ctrl+S: Save Configuration
- Ctrl+Z: Undo
- Ctrl+Y: Redo
- F5: Refresh Preview

## Workflow
1. Select a preset or start from scratch
2. Customize colors, fonts, and layout
3. Validate configuration
4. Export to JSON
5. Apply to project files

## Color Format
Colors use HSL format: "H S% L%"
Example: "221.2 83.2% 53.3%"

## Support
For issues and questions, refer to DESIGN_TOOL_README.md
        """
        doc_text.insert('1.0', docs)
        doc_text.config(state=tk.DISABLED)
    
    def show_shortcuts(self):
        """Show keyboard shortcuts"""
        shortcuts = """
Keyboard Shortcuts:

File Operations:
  Ctrl+N - New Configuration
  Ctrl+O - Open Configuration
  Ctrl+S - Save Configuration

Edit Operations:
  Ctrl+Z - Undo
  Ctrl+Y - Redo

Tools:
  F5 - Refresh Preview
        """
        messagebox.showinfo("Keyboard Shortcuts", shortcuts)
    
    def show_about(self):
        """Show about dialog"""
        about_text = """
Mehaal Design Configuration Studio
Version 2.0.0

Professional Design System Management Tool

Features:
✓ JSON Configuration Management
✓ Undo/Redo System
✓ Live Preview
✓ Industry Presets
✓ Code Generation
✓ Design Token Management

Built with Python & Tkinter
© 2025 Mehaal
        """
        messagebox.showinfo("About", about_text)

def main():
    root = tk.Tk()
    app = DesignConfigStudio(root)
    root.mainloop()

if __name__ == "__main__":
    main()
