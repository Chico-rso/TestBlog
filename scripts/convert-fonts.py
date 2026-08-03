#!/usr/bin/env python3
"""Convert the bundled Montserrat variable fonts to WOFF2."""

from pathlib import Path

from fontTools.ttLib import TTFont


PROJECT_DIRECTORY = Path(__file__).resolve().parents[1]
FONT_SOURCE_DIRECTORY = PROJECT_DIRECTORY / "assets" / "fonts" / "Montserrat"
FONT_OUTPUT_DIRECTORY = PROJECT_DIRECTORY / "public" / "fonts"
FONT_FILES = {
	"Montserrat-VariableFont_wght.ttf": "Montserrat-VariableFont_wght.woff2",
	"Montserrat-Italic-VariableFont_wght.ttf": "Montserrat-Italic-VariableFont_wght.woff2",
}


def convert_font(source_name: str, output_name: str) -> None:
	source_path = FONT_SOURCE_DIRECTORY / source_name
	output_path = FONT_OUTPUT_DIRECTORY / output_name
	font = TTFont(source_path, recalcTimestamp=False)
	font.flavor = "woff2"
	font.save(output_path)
	font.close()


def main() -> None:
	FONT_OUTPUT_DIRECTORY.mkdir(parents=True, exist_ok=True)
	for source_name, output_name in FONT_FILES.items():
		convert_font(source_name, output_name)


if __name__ == "__main__":
	main()
