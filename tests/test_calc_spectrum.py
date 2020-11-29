import pytest


@pytest.fixture(autouse=True)
def _open_base_url(sb, base_url):
    sb.open(base_url)


def test_set_molecule(sb):
    sb.type("#molecule-selector", "h2o")
    sb.click("#molecule-selector-option-0")
    sb.click("#calc-spectrum-button")
    sb.assert_text("Spectrum for H₂O")


def test_no_data_at_wavenumber_range(sb):
    sb.type("#min-wavenumber-input", 1000)
    sb.type("#max-wavenumber-input", 1001)
    sb.click("#calc-spectrum-button")
    sb.assert_text("No spectrum at specified wavenumber range")


def test_tgas(sb):
    sb.type("#tgas-input", "")
    sb.assert_text("Tgas must be defined")
    sb.assert_element("#calc-spectrum-button:disabled")

    sb.type("#tgas-input", "1")
    sb.assert_text("Tgas must be between 70K and 3000K")
    sb.assert_element("#calc-spectrum-button:disabled")

    sb.type("#tgas-input", "4000")
    sb.assert_text("Tgas must be between 70K and 3000K")
    sb.assert_element("#calc-spectrum-button:disabled")

    sb.type("#tgas-input", "80")
    sb.click("#calc-spectrum-button")
    sb.assert_text("Spectrum for CO")


def test_tvib(sb):
    # Can be undefined
    sb.type("#tvib-input", "")
    sb.click("#calc-spectrum-button")
    sb.assert_text("Spectrum for CO")
