# Kubectl cheatsheet

## Get, Describe, Delete, Apply, Rollouts, Expose and Port-forward

````bash
# BASIC COMMANDS

kubectl get pods                                 # List all pods in the current namespace
kubectl get nodes                                # List all nodes in the cluster
kubectl get services                             # List all services in the current namespace
kubectl get deployments                          # List all deployments in the current namespace
kubectl describe pod <pod-name>                  # Show detailed information about a pod
kubectl describe node <node-name>                # Show detailed information about a node
kubectl describe svc <service-name>              # Show detailed information about a service
kubectl delete pod <pod-name>                    # Delete a specific pod
kubectl delete <resource> <resource-name>        # Delete a specific resource (ingress, deployment)
kubectl get all -n <namespace>                   # Show detailed information about all resources and workloads within the defined namespace
kubectl get all -n <namespace> -o wide           # Show ALL details for all workloads within the defined namespace

# NAMESPACES

kubectl get namespaces                           # List all namespaces
kubectl get pods -n <namespace>                  # List pods in a specific namespace
kubectl delete namespace <namespace>             # Delete a specific namespace

# FILTERING OUTPUT
kubectl get pods -o wide                         # List pods with additional details
kubectl get pods -n <namespace>                  # List pods in a specific namespace
kubectl get pods --selector <key>=<value>        # List pods using a label selector

# CONFIGURATION AND MANAGEMENT
kubectl apply -f <file.yaml>                     # Apply changes to a resource from a YAML file
kubectl create namespace <namespace>             # Create a new namespace
kubectl config view                              # View Kubernetes cluster configuration
kubectl config use-context <context>             # Switch between contexts
kubectl edit deployment <deployment>             # Edit an existing deployment

# LOGS AND DEBUGGING
kubectl logs <pod-name>                          # View logs of a specific pod
kubectl logs <pod-name> -c <container>           # View logs of a specific container in a pod
kubectl exec -it <pod-name> -- /bin/bash         # Access a pod's shell
kubectl top pods                                 # Show resource usage for pods
kubectl top nodes                                # Show resource usage for nodes

# DEPLOYMENT MANAGEMENT
kubectl scale deployment <deployment> --replicas=<count>  # Scale a deployment
kubectl rollout status deployment <deployment>            # Check the status of a deployment
kubectl rollout undo deployment <deployment>              # Rollback a deployment
kubectl rollout restart deployment <deployment-name>      # Restart a deployment

# PORT-FORWARDING AND ACCESS
kubectl port-forward <pod-name> 8080:80         # Forward local port 8080 to pod port 80
kubectl expose pod <pod-name> --type=NodePort --port=80  # Expose a pod as a service
````

## Ingress and Configmap commands

````bash
# INSPECTING AND CLEANUP
kubectl get events                               # Show cluster events
kubectl delete all --all                         # Delete all resources in the current namespace
kubectl cluster-info                             # Display cluster information

# INGRESS COMMANDS
kubectl get ingress                             # List all Ingress resources in the current namespace
kubectl get ingress -n <namespace>              # List all Ingress resources in a specific namespace
kubectl describe ingress <ingress-name>         # Show details of a specific Ingress resource
kubectl edit ingress <ingress-name>             # Edit an existing Ingress resource
kubectl delete ingress <ingress-name>           # Delete a specific Ingress resource

# INGRESS LOGS
kubectl logs <ingress-controller-pod>           # Check logs of the ingress controller

# ADDITIONAL INGRESS CONTROLLER COMMANDS
kubectl get pods -n <ingress-namespace>         # Verify the Ingress controller is running
kubectl get svc -n <ingress-namespace>          # Get the service of the Ingress controller
kubectl describe svc <ingress-controller-service> -n <namespace>  # View details of the Ingress controller service

# CONFIGMAP COMMANDS
kubectl create configmap <configmap-name> --from-literal=<key>=<value>  # Create a ConfigMap from literal values
kubectl create configmap <configmap-name> --from-file=<file>           # Create a ConfigMap from a file
kubectl get configmaps                          # List all ConfigMaps in the current namespace
kubectl get configmaps -n <namespace>           # List all ConfigMaps in a specific namespace
kubectl describe configmap <configmap-name>     # Show details of a specific ConfigMap
kubectl edit configmap <configmap-name>         # Edit an existing ConfigMap
kubectl delete configmap <configmap-name>       # Delete a specific ConfigMap

# Use ConfigMap in a Pod
kubectl exec -it <pod-name> -- env | grep <configmap-key>  # Verify the ConfigMap is mounted as environment variables
````

## Node taint, node drain commands, daemonset & statefulset commands

````bash
# TAINTS COMMANDS
kubectl taint nodes <node-name> <key>=<value>:<effect>  # Add a taint to a node
# Example: kubectl taint nodes node1 key=value:NoSchedule
# Prevent pods without tolerations from scheduling on this node

kubectl taint nodes <node-name> <key>-                # Remove a taint from a node
# Example: kubectl taint nodes node1 key-
# Removes the taint with key "key"

kubectl get nodes --show-labels                      # List nodes with their labels and taints
kubectl describe node <node-name>                    # View details of a node, including taints

# DRAIN COMMANDS
kubectl drain <node-name>                            # Evict all pods from a node (prepare for maintenance)
# Example: kubectl drain node1 --ignore-daemonsets --delete-emptydir-data
# Options:
# --ignore-daemonsets: Ignore daemonsets during drain
# --delete-emptydir-data: Force eviction of pods with 'emptyDir' volumes

kubectl cordon <node-name>                           # Mark a node as unschedulable (prevent new pods from being scheduled)
# Example: kubectl cordon node1

kubectl uncordon <node-name>                         # Mark a node as schedulable (allow new pods to be scheduled)
# Example: kubectl uncordon node1

# ADDITIONAL USEFUL COMMANDS
kubectl get nodes -o wide                            # View node statuses and scheduling availability
kubectl describe node <node-name>                    # Check node taints and conditions
kubectl get pods -o wide                             # Verify where pods are running
kubectl delete pod <pod-name> --grace-period=0 --force  # Force delete a pod (if drain gets stuck)

# DAEMONSET COMMANDS
kubectl get daemonsets                             # List all DaemonSets in the current namespace
kubectl get daemonsets -n <namespace>              # List all DaemonSets in a specific namespace
kubectl describe daemonset <daemonset-name>        # Show details of a specific DaemonSet
kubectl edit daemonset <daemonset-name>            # Edit a DaemonSet definition
kubectl delete daemonset <daemonset-name>          # Delete a specific DaemonSet

# STATEFULSET COMMANDS
kubectl get statefulsets                           # List all StatefulSets in the current namespace
kubectl get statefulsets -n <namespace>            # List all StatefulSets in a specific namespace
kubectl describe statefulset <statefulset-name>    # Show details of a specific StatefulSet
kubectl edit statefulset <statefulset-name>        # Edit a StatefulSet definition
kubectl delete statefulset <statefulset-name>      # Delete a specific StatefulSet
kubectl scale statefulset <statefulset-name> --replicas=<count>  # Scale a StatefulSet
````

## Kubectl kubernetes RBAC commands

````bash
# RBAC (ROLE-BASED ACCESS CONTROL) COMMANDS
kubectl get roles                                 # List all roles in the current namespace
kubectl get clusterroles                          # List all cluster-wide roles
kubectl get rolebindings                          # List all RoleBindings in the current namespace
kubectl get clusterrolebindings                   # List all cluster-wide RoleBindings
kubectl describe role <role-name>                 # View details of a specific Role
kubectl describe clusterrole <clusterrole-name>   # View details of a ClusterRole

kubectl create role <role-name> --verb=<verb> --resource=<resource> --namespace=<namespace>
# Example: kubectl create role pod-reader --verb=get,list --resource=pods --namespace=dev

kubectl create rolebinding <binding-name> --role=<role-name> --user=<user> --namespace=<namespace>
# Example: kubectl create rolebinding pod-reader-binding --role=pod-reader --user=dev-user --namespace=dev

kubectl delete role <role-name>                   # Delete a specific Role
kubectl delete rolebinding <binding-name>         # Delete a specific RoleBinding

kubectl auth can-i <verb> <resource> --namespace=<namespace>
# Example: kubectl auth can-i create pods --namespace=dev  # Check RBAC permissions

# CRD (CUSTOM RESOURCE DEFINITION) COMMANDS
kubectl get crds                                  # List all CRDs in the cluster
kubectl describe crd <crd-name>                   # View details of a specific CRD
kubectl delete crd <crd-name>                     # Delete a specific CRD

kubectl get <cr-kind>                            # List custom resources of the given kind
kubectl get <cr-kind> -n <namespace>             # List custom resources in a specific namespace
kubectl describe <cr-kind> <cr-name>             # Show details of a specific custom resource
kubectl apply -f <cr.yaml>                       # Create or update a custom resource
kubectl delete <cr-kind> <cr-name>               # Delete a specific custom resource

kubectl get crds -o wide                         # Show additional details about CRDs
kubectl explain <cr-kind>                        # Show schema and details about the custom resource
kubectl explain <cr-kind> --recursive            # Show detailed schema of the custom resource
````
