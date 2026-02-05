{{- define "devops-hub.fullname" -}}
{{ .Release.Name }}-{{ .Chart.Name }}
{{- end }}
