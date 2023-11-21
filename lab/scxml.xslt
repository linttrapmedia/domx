<xsl:stylesheet
    version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
>
    <xsl:output indent="yes" cdata-section-elements="style" />

    <xsl:template match="/scxml">
        <svg>
            <defs>
                <style type="text/css">@import url('scxml.css');</style>
            </defs>
            <script type="text/ecmascript" xlink:href="{@js}" />
            <g transform="translate(10, 10)">
                <xsl:apply-templates select="state" />
            </g>
        </svg>
    </xsl:template>

    <!-- State Template -->
    <xsl:template match="state">
        <circle id="{@id}" cx="{position()*100}" cy="50" r="40" style="fill:{@color};opacity:0.25;" />
    </xsl:template>

</xsl:stylesheet>