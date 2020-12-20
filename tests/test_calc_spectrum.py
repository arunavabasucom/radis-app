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

    # But can't be undefined if Trot is defined
    sb.type("#trot-input", "80")
    sb.assert_text("Tvib must be defined if Trot is defined")
    sb.assert_element("#calc-spectrum-button:disabled")


def test_trot(sb):
    # Can be undefined
    sb.type("#trot-input", "")
    sb.click("#calc-spectrum-button")
    sb.assert_text("Spectrum for CO")

    # But can't be undefined if Tvib is defined
    sb.type("#tvib-input", "80")
    sb.assert_text("Trot must be defined if Tvib is defined")
    sb.assert_element("#calc-spectrum-button:disabled")


def test_pressure(sb):
    sb.type("#pressure-input", "")
    sb.assert_text("Pressure must be defined")
    sb.assert_element("#calc-spectrum-button:disabled")

    sb.type("#pressure-input", "-1")
    sb.assert_text("Pressure must be positive")
    sb.assert_element("#calc-spectrum-button:disabled")

    sb.type("#pressure-input", "1.4")
    sb.click("#calc-spectrum-button")
    sb.assert_text("Spectrum for CO")


def test_path_length(sb):
    sb.type("#path-length-input", "")
    sb.assert_text("Path length must be defined")
    sb.assert_element("#calc-spectrum-button:disabled")

    sb.type("#path-length-input", "-1")
    sb.assert_text("Path length must be positive")
    sb.assert_element("#calc-spectrum-button:disabled")

    sb.type("#path-length-input", "0.9")
    sb.click("#calc-spectrum-button")
    sb.assert_text("Spectrum for CO")
