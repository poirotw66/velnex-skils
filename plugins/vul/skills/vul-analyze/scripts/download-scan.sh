#!/bin/bash
# download-scan.sh - 從 GCS 下載弱掃報告
#
# Usage: ./download-scan.sh <project> <commit> [bucket]
# Example: ./download-scan.sh my-project 53f4614 gs://my-scan-bucket
#
# Note: 建議先執行 check-scan.sh 確認 GCS 上有報告再執行此腳本

set -e

PROJECT="${1:?'Project name is required'}"
COMMIT="${2:?'Commit hash is required'}"
COMMIT_7="${COMMIT:0:7}"

GCS_BUCKET="${3:-${VULN_SCAN_BUCKET:?'GCS bucket is required. Pass as 3rd argument or set VULN_SCAN_BUCKET env var.'}}"
GCS_PATH="${GCS_BUCKET}/${PROJECT}/${COMMIT_7}"
LOCAL_PATH=".security-scans/${COMMIT_7}"

echo "📥 下載弱掃報告"
echo "專案: ${PROJECT}"
echo "Commit: ${COMMIT_7}"
echo "GCS 路徑: ${GCS_PATH}"
echo ""

# 建立本地目錄
mkdir -p "${LOCAL_PATH}"

# 預期的檔案清單（共 8 個）
FILES=(
    "cxone-report.json"
    "cxone-report.pdf"
    "MendReportResource.json"
    "MendReport.pdf"
    "MendReportLicense.json"
    "MendReportImgResource.json"
    "MendReportImg.pdf"
    "MendReportImgLicense.json"
)

# 下載檔案
echo "📦 下載中..."
for FILE in "${FILES[@]}"; do
    echo "  - ${FILE}"
    if gsutil cp "${GCS_PATH}/${FILE}" "${LOCAL_PATH}/" 2>/dev/null; then
        echo "    ✅ 成功"
    else
        echo "    ⚠️  檔案不存在或下載失敗: ${FILE}"
    fi
done

# 確保 .security-scans 在 .gitignore 中
if [ -f .gitignore ]; then
    if ! grep -q "^\.security-scans" .gitignore; then
        echo "" >> .gitignore
        echo "# Security scan files (downloaded from GCS)" >> .gitignore
        echo ".security-scans/" >> .gitignore
        echo "📝 已將 .security-scans/ 加入 .gitignore"
    fi
else
    echo "# Security scan files (downloaded from GCS)" > .gitignore
    echo ".security-scans/" >> .gitignore
    echo "📝 已建立 .gitignore 並加入 .security-scans/"
fi

echo ""
echo "✅ 下載完成！檔案位於: ${LOCAL_PATH}/"
ls -la "${LOCAL_PATH}/"
