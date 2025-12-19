#!/usr/bin/env python
import os
import sys
from alembic.config import Config
from alembic.command import upgrade, downgrade

def run_migrations(direction="up"):
    alembic_cfg = Config("alembic.ini")
    if direction == "up":
        upgrade(alembic_cfg, "head")
    elif direction == "down":
        downgrade(alembic_cfg, "-1")

if __name__ == "__main__":
    direction = sys.argv[1] if len(sys.argv) > 1 else "up"
    run_migrations(direction)
