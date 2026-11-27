# Contributing

Thank you for considering a contribution to NetworkLab AI.

## Before opening a pull request

1. Open an issue describing the problem or proposed feature.
2. Keep changes focused and explain the educational value.
3. Do not commit API keys, `.env` files, private documents, or personal data.
4. Add or update tests for changed behavior.
5. Update the README when setup or user-facing behavior changes.

## Development setup

```powershell
py -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m pip install pytest
```

## Quality checks

```powershell
python -m compileall src app.py
python -m pytest -q
```

## Pull request checklist

- [ ] The change has a clear purpose.
- [ ] Tests pass locally.
- [ ] Documentation is updated.
- [ ] No secrets or private data are included.
- [ ] Limitations and behavior changes are described.
