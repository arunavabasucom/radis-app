import pytest


@pytest.fixture(autouse=True)
def _open_base_url(sb, base_url):
    sb.open(base_url)


def test_set_molecule(sb):
    sb.type("#molecule-selector", "h2o")
    sb.click("#molecule-selector-option-0")
    sb.click("button:contains('Calculate spectrum')")
    sb.assert_text("Spectrum for H₂O")


def test_no_data_at_wavenumber_range(sb):
    sb.type("#min-wavenumber-input", 1000)
    sb.type("#max-wavenumber-input", 1001)
    sb.click("button:contains('Calculate spectrum')")
    sb.assert_text("No spectrum at specified wavenumber range")
