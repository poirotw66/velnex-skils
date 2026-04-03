#!/bin/bash
# check-scan.sh - 檢查 GCS 上是否有弱掃報告（不下載）
#
# Usage: ./check-scan.sh <project> <commit> [bucket]
# Example: ./check-scan.sh my-project 53f4614 gs://my-scan-bucket
#
# Exit codes:
#   0 - 找到掃描報告
#   1 - 找不到掃描報告或參數錯誤
#   2 - gsutil 未安裝

set -e

PROJECT="${1:?'Project name is required'}"
COMMIT="${2:?'Commit hash is required'}"
COMMIT_7="${COMMIT:0:7}"

GCS_BUCKET="${3:-${VULN_SCAN_BUCKET:?'GCS bucket is required. Pass as 3rd argument or set VULN_SCAN_BUCKET env var.'}}"
GCS_PATH="${GCS_BUCKET}/${PROJECT}/${COMMIT_7}"

echo "🔍 檢查 GCS 上的弱掃報告"
echo "專案: ${PROJECT}"
echo "Commit: ${COMMIT_7}"
echo "GCS 路徑: ${GCS_PATH}"
echo ""

# 檢查 gsutil 是否可用
if ! command -v gsutil &> /dev/null; then
    echo "❌ 錯誤: gsutil 未安裝。請安裝 Google Cloud SDK。"
    exit 2
fi

# 檢查 GCS 上的檔案
if ! gsutil ls "${GCS_PATH}/" &> /dev/null; then
    echo "❌ 找不到 commit ${COMMIT_7} 的掃描報告"
    echo ""
    echo "請確認:"
    echo "  1. Commit ${COMMIT_7} 是否有執行過弱掃"
    echo "  2. 專案名稱 ${PROJECT} 是否正確"
    echo "  3. 是否有 GCS bucket 存取權限"
    echo ""
    echo "GCS 路徑: ${GCS_PATH}/"
    exit 1
fi

# 列出找到的檔案
echo "✅ 找到掃描報告："
gsutil ls "${GCS_PATH}/" | sed 's|.*/||'
echo ""

echo "🎯 預期檔案（共 8 個）："
echo "  Checkmarx SAST (2 個):"
echo "    - cxone-report.json"
echo "    - cxone-report.pdf"
echo ""
echo "  Mend 依賴掃描 (3 個):"
echo "    - MendReportResource.json"
echo "    - MendReport.pdf"
echo "    - MendReportLicense.json"
echo ""
echo "  Mend Image 掃描 (3 個):"
echo "    - MendReportImgResource.json"
echo "    - MendReportImg.pdf"
echo "    - MendReportImgLicense.json"
echo ""

exit 0
