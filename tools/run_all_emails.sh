#!/bin/bash
# Re-run the whole email pipeline: list matching, pattern spreading, merge, email bank, workbook.
# Add a new list as data/<name>.txt and run:  ./run_all_emails.sh
cd "$(dirname "$0")" || exit 1
EM=(); DL=()
for f in data/*.txt; do EM+=(--emails "$f" --source domain_list); DL+=(--domain-lists "$f"); done
FIND=(); for f in "$HOME"/Downloads/*-all.csv; do [ -e "$f" ] && FIND+=(--finder "$f"); done   # every Hunter bulk result you downloaded
VER=(); [ -f final/verification_specs.txt ] && while IFS= read -r line; do
  case "$line" in
    "") ;;
    validonly:*) VER+=(--verification-valid-only "${line#validonly:}") ;;   # Reacher: only a "valid" answer counts
    *) VER+=(--verification "$line") ;;
  esac
done < final/verification_specs.txt
set -x
python3 match_emails.py --people final/people_with_crustdata.csv --orgs final/orgs_final.csv "${EM[@]}" --emails data/apollo_screenshot_emails.csv --source apollo_manual --out final/matched_emails.csv
python3 infer_email_patterns.py --people final/people_with_crustdata.csv --orgs final/orgs_final.csv --extra-emails final/matched_emails.csv "${DL[@]}" --domain-patterns data/domain_patterns.csv --out final/inferred_from_lists.csv
python3 build_work_emails.py --people final/people_with_crustdata.csv --crustdata final/work_emails.csv --verified final/inferred_emails_verified.csv --orgs final/orgs_final.csv --matched final/matched_emails.csv --guesses final/inferred_from_lists.csv "${FIND[@]}" "${VER[@]}" --out final/people_with_emails.csv
python3 build_email_bank.py --final final --lists data
python3 make_workbook.py --final final --out "$HOME/Downloads/imaging-leads" --facilities "$HOME/Downloads/freestanding-mri-ct-facilities.csv"
