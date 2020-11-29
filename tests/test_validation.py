def test_set_molecule(sb, base_url):
    sb.open(base_url)
    sb.type("#molecule-selector", "h2o")
    sb.click("#molecule-selector-option-0")
    sb.click("button:contains('Calculate spectrum')")
    sb.assert_text("Spectrum for H₂O")
