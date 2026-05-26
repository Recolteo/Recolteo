import "server-only";
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
  type DocumentProps,
} from "@react-pdf/renderer";
import type { ReactElement } from "react";

const S = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    padding: 36,
    color: "#000",
    lineHeight: 1.4,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  repFr: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    width: 60,
  },
  mainTitleWrap: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 8,
  },
  mainTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    lineHeight: 1.5,
  },
  cerfaMeta: {
    width: 110,
    alignItems: "flex-end",
  },
  cerfaCode: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
  },
  ordreBox: {
    borderWidth: 1,
    borderColor: "#000",
    minWidth: 80,
    minHeight: 18,
    marginTop: 4,
    padding: 3,
    alignItems: "center",
  },
  section: {
    borderWidth: 1,
    borderColor: "#000",
    marginBottom: 6,
  },
  sectionHeader: {
    backgroundColor: "#d0d0d0",
    padding: "4 6",
  },
  sectionHeaderText: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: "3 6",
    borderTopWidth: 0.5,
    borderColor: "#bbb",
  },
  fieldLabel: {
    fontFamily: "Helvetica-Bold",
    width: 130,
    flexShrink: 0,
    fontSize: 8,
  },
  fieldValue: {
    flex: 1,
    borderBottomWidth: 0.5,
    borderColor: "#555",
    paddingBottom: 1,
    fontSize: 9,
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: "3 6",
    borderTopWidth: 0.5,
    borderColor: "#bbb",
    gap: 5,
  },
  checkBox: {
    width: 9,
    height: 9,
    borderWidth: 1,
    borderColor: "#000",
    flexShrink: 0,
    marginTop: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  checkBoxFilled: {
    width: 9,
    height: 9,
    borderWidth: 1,
    borderColor: "#000",
    flexShrink: 0,
    marginTop: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  checkLabel: {
    flex: 1,
    fontSize: 8,
  },
  subCheck: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginLeft: 14,
    marginTop: 2,
    gap: 5,
  },
  smallCircle: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    borderWidth: 1,
    borderColor: "#000",
    flexShrink: 0,
    marginTop: 1,
    backgroundColor: "#000",
  },
  dottedLine: {
    borderBottomWidth: 0.5,
    borderColor: "#555",
    borderStyle: "dashed",
    marginBottom: 2,
    marginTop: 2,
  },
  signatureRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#000",
    marginTop: 6,
  },
  signatureLeft: {
    flex: 1,
    padding: 8,
    borderRightWidth: 0.5,
    borderColor: "#bbb",
  },
  signatureRight: {
    flex: 1,
    padding: 8,
  },
  footer: {
    marginTop: 8,
    borderTopWidth: 0.5,
    borderColor: "#bbb",
    paddingTop: 4,
  },
  footerText: {
    fontSize: 6.5,
    color: "#555",
    lineHeight: 1.4,
  },
  bold: { fontFamily: "Helvetica-Bold" },
  mt4: { marginTop: 4 },
  mt8: { marginTop: 8 },
});

export type CerfaData = {
  numOrdre: string | number;
  association: {
    name_entreprise: string;
    rna: string;
    adresse: string;
  };
  commercant: {
    name_entreprise: string;
    forme_juridique: string;
    siret: string;
    adresse: string;
  };
  lot: {
    nature: string;
    quantity: number;
    montant_chiffre: number;
    montant_lettre: string;
  };
  dateCollect: string;
};

function CerfaDocument({
  numOrdre,
  association,
  commercant,
  lot,
  dateCollect,
}: CerfaData) {
  const siren = commercant.siret.replace(/\s/g, "").substring(0, 9);

  return (
    <Document title={`CERFA 16216-03 — Reçu fiscal n°${numOrdre}`}>
      <Page size="A4" style={S.page}>
        {/* ── En-tête ── */}
        <View style={S.topRow}>
          <View style={S.repFr}>
            <Text>RÉPUBLIQUE</Text>
            <Text>FRANÇAISE</Text>
          </View>
          <View style={S.mainTitleWrap}>
            <Text style={S.mainTitle}>
              Reçu des dons et versements effectués par{"\n"}
              les entreprises au titre de l'article 238 bis du{"\n"}
              code général des impôts
            </Text>
          </View>
          <View style={S.cerfaMeta}>
            <Text style={S.cerfaCode}>2041-MEC-SD</Text>
            <Text style={{ fontSize: 8, marginTop: 2 }}>
              N° Cerfa : 16216*03
            </Text>
            <Text style={{ fontSize: 7, marginTop: 4 }}>
              Numéro d'ordre du reçu
            </Text>
            <View style={S.ordreBox}>
              <Text style={S.bold}>{numOrdre}</Text>
            </View>
          </View>
        </View>

        {/* ── Organisme bénéficiaire ── */}
        <View style={S.section}>
          <View style={S.sectionHeader}>
            <Text style={S.sectionHeaderText}>
              Organisme bénéficiaire des dons et versements
            </Text>
          </View>
          <View style={S.fieldRow}>
            <Text style={S.fieldLabel}>Dénomination de l'organisme :</Text>
            <Text style={S.fieldValue}>{association.name_entreprise}</Text>
          </View>
          <View style={S.fieldRow}>
            <Text style={S.fieldLabel}>Numéro RNA :</Text>
            <Text style={S.fieldValue}>{association.rna}</Text>
          </View>
          <View style={S.fieldRow}>
            <Text style={S.fieldLabel}>Adresse :</Text>
            <Text style={S.fieldValue}>{association.adresse}</Text>
          </View>
          <View style={S.fieldRow}>
            <Text style={S.fieldLabel}>Objet :</Text>
            <Text style={S.fieldValue}>Don de denrées alimentaires</Text>
          </View>

          {/* Checkbox section */}
          <View style={{ padding: "4 6", borderTopWidth: 0.5, borderColor: "#bbb" }}>
            <Text style={[S.bold, { fontSize: 8, marginBottom: 4 }]}>
              Cochez la case qui vous concerne :
            </Text>

            {/* Case principale cochée */}
            <View style={S.checkRow}>
              <View style={S.checkBoxFilled}>
                <Text style={{ color: "#fff", fontSize: 7, fontFamily: "Helvetica-Bold" }}>
                  ✓
                </Text>
              </View>
              <Text style={S.checkLabel}>
                Œuvre ou organisme d'intérêt général ayant un caractère
                philanthropique, éducatif, scientifique, social, humanitaire,
                sportif, familial, culturel ou concourant à l'égalité entre les
                femmes et les hommes, à la mise en valeur du patrimoine
                artistique, à la défense de l'environnement naturel ou à la
                diffusion de la culture, de la langue et des connaissances
                scientifiques françaises. Précisez si vous êtes :
              </Text>
            </View>

            {/* Sous-case cochée */}
            <View style={S.subCheck}>
              <View style={S.smallCircle} />
              <Text style={{ fontSize: 8, flex: 1 }}>
                Organismes sans but lucratif fournissant gratuitement une aide
                alimentaire, des soins médicaux ou des produits de première
                nécessité à des personnes en difficulté ou favorisant leur
                logement
              </Text>
            </View>
          </View>
        </View>

        {/* ── Entreprise donatrice ── */}
        <View style={S.section}>
          <View style={S.sectionHeader}>
            <Text style={S.sectionHeaderText}>Entreprise donatrice</Text>
          </View>
          <View style={S.fieldRow}>
            <Text style={S.fieldLabel}>Dénomination de l'entreprise :</Text>
            <Text style={S.fieldValue}>{commercant.name_entreprise}</Text>
          </View>
          <View style={S.fieldRow}>
            <Text style={S.fieldLabel}>Forme juridique :</Text>
            <Text style={S.fieldValue}>{commercant.forme_juridique}</Text>
          </View>
          <View style={S.fieldRow}>
            <Text style={S.fieldLabel}>Numéro SIREN :</Text>
            <Text style={S.fieldValue}>{siren}</Text>
          </View>
          <View style={S.fieldRow}>
            <Text style={S.fieldLabel}>Adresse :</Text>
            <Text style={S.fieldValue}>{commercant.adresse}</Text>
          </View>
        </View>

        {/* ── Dons en nature ── */}
        <View style={S.section}>
          <View style={S.sectionHeader}>
            <Text style={S.sectionHeaderText}>
              Dons et versements effectués par l'entreprise
            </Text>
          </View>
          <View style={{ padding: "6 6" }}>
            <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold" }}>
              L'organisme bénéficiaire reconnaît avoir reçu, au titre de la
              réduction d'impôt prévue à l'article 238 bis du code général des
              impôts, des dons en nature pour une valeur en euros égale à :
            </Text>
            <Text style={[S.bold, S.mt4]}>
              {lot.montant_chiffre.toFixed(2)} euros
            </Text>
            <View style={S.dottedLine} />
            <Text style={{ fontSize: 8, marginTop: 4 }}>
              Indiquez la valeur totale des dons en nature en toutes lettres :
            </Text>
            <Text style={[S.bold, S.mt4]}>{lot.montant_lettre}</Text>
            <View style={S.dottedLine} />

            <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", marginTop: 8 }}>
              Description exhaustive des biens et prestations reçus et acceptés
              (nature et quantité) :
            </Text>
            <Text style={S.mt4}>
              {lot.nature} — Quantité : {lot.quantity}
            </Text>
            <View style={S.dottedLine} />

            <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", marginTop: 8 }}>
              Date au cours de laquelle les dons ont été effectués :
            </Text>
            <Text style={S.mt4}>{dateCollect}</Text>
            <View style={S.dottedLine} />
          </View>
        </View>

        {/* ── Date et signature ── */}
        <View style={S.signatureRow}>
          <View style={S.signatureLeft}>
            <Text style={{ fontSize: 8 }}>
              Document établi via la plateforme Récoltéo suite à validation de
              la collecte par le commerçant.
            </Text>
            <Text style={{ fontSize: 7, color: "#555", marginTop: 4 }}>
              La validation électronique du code de retrait par le commerçant
              vaut acceptation et réception du don par l'association.
            </Text>
          </View>
          <View style={S.signatureRight}>
            <Text style={[S.bold, { fontSize: 8 }]}>Date et signature</Text>
            <Text style={{ fontSize: 8, marginTop: 6 }}>Le {dateCollect}</Text>
            <View style={{ marginTop: 16, borderTopWidth: 0.5, borderColor: "#bbb", paddingTop: 6 }}>
              <Text style={{ fontSize: 7, color: "#555" }}>
                Signé électroniquement par :
              </Text>
              <Text style={[S.bold, { fontSize: 9, marginTop: 2 }]}>
                {association.name_entreprise}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Footer légal ── */}
        <View style={S.footer}>
          <Text style={S.footerText}>
            Ce document est généré automatiquement par la plateforme Récoltéo et constitue un reçu fiscal
            valable au titre de l'article 238 bis du Code général des impôts. L'organisme bénéficiaire des
            dons en nature reporte sur le reçu fiscal le montant indiqué par l'entreprise donatrice.
          </Text>
        </View>
      </Page>
    </Document>
  );
}

export async function generateCerfa(data: CerfaData): Promise<Buffer> {
  const element = React.createElement(CerfaDocument, data) as ReactElement<DocumentProps>;
  return renderToBuffer(element) as Promise<Buffer>;
}
