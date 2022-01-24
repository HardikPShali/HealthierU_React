pipeline {

  agent any
  
  stages {
    stage('Build DEV') {
      when {
        branch 'dev'
      }
      steps {
        echo 'Building Project for dev'
        slackSend(channel: 'jenkins-build-status', color: 'good', message: "The pipeline ${PROJECT_NAME} ${GIT_BRANCH} branch commit ${GIT_COMMIT} has started.", notifyCommitters: true, teamDomain: 'g42-healthcare', tokenCredentialId: 'slack-login', username: 'Jenkins')
        sh 'docker build -t $AZURE_CR_REGISTRY_DEV/$AZURE_CR_REPOSITORY_DEV:$IMAGE_TAG -f ./docker/Dockerfile_dev .'
      }
    }

    stage('Build TEST') {
      when {
        branch 'test'
      }
      steps {
        echo 'Building Project for test'
        slackSend(channel: 'jenkins-build-status', color: 'good', message: "The pipeline ${PROJECT_NAME} ${GIT_BRANCH} branch commit ${GIT_COMMIT} has started.", notifyCommitters: true, teamDomain: 'g42-healthcare', tokenCredentialId: 'slack-login', username: 'Jenkins')
        sh 'docker build -t $AZURE_CR_REGISTRY_TEST/$AZURE_CR_REPOSITORY_TEST:$IMAGE_TAG -f ./docker/Dockerfile .'
      }
    }

    stage('Build PROD') {
      when {
        branch 'master'
      }
      steps {
        echo 'Building Project for prod'
        slackSend(channel: 'jenkins-build-status', color: 'good', message: "The pipeline ${PROJECT_NAME} ${GIT_BRANCH} branch commit ${GIT_COMMIT} has started.", notifyCommitters: true, teamDomain: 'g42-healthcare', tokenCredentialId: 'slack-login', username: 'Jenkins')
        sh 'docker build -t $AZURE_CR_REGISTRY_PROD/$AZURE_CR_REPOSITORY_PROD:$IMAGE_TAG -f ./docker/Dockerfile .'
      }
    }

    stage('Push DEV') {
      when {
        branch 'dev'
      }
      steps {
        echo 'Pushing dev image to Azure CR'
         withDockerRegistry([credentialsId: 'azure-cr-creds', url: "https://$AZURE_CR_REGISTRY_DEV"]) {
          sh 'docker push $AZURE_CR_REGISTRY_DEV/$AZURE_CR_REPOSITORY_DEV:$IMAGE_TAG'
        }
      }
    }

    stage('Push TEST') {
      when {
        branch 'test'
      }
      steps {
        echo 'Pushing test image to Azure CR'
        withDockerRegistry([credentialsId: 'azure-cr-creds', url: "https://$AZURE_CR_REGISTRY_TEST"]) {
          sh 'docker push $AZURE_CR_REGISTRY_TEST/$AZURE_CR_REPOSITORY_TEST:$IMAGE_TAG'
        }
      }
    }

    stage('Push PROD') {
      when {
        branch 'master'
      }
      steps {
        echo 'Pushing prod image to Azure CR'
        withDockerRegistry([credentialsId: 'azure-cr-creds', url: "https://$AZURE_CR_REGISTRY_PROD"]) {
          sh 'docker push $AZURE_CR_REGISTRY_PROD/$AZURE_CR_REPOSITORY_PROD:$IMAGE_TAG'
        }
      }
    }

    stage('Deploy on DEV') {
      when {
        branch 'dev'
      }
      steps {
        echo 'Deploying on Azure Dev'
        script {
          def remote = [:]
          remote.name = 'webapp_dev_server'
          remote.host = '10.210.1.5'
          remote.allowAnyHosts = true

          withCredentials([sshUserPrivateKey(
            credentialsId: 'azure-gitlab-ci', 
            keyFileVariable: 'identity', 
            passphraseVariable: '',
            usernameVariable: 'userName'
          )]) {
            remote.user = userName
            remote.identityFile = identity

            sshCommand remote: remote, command: "cd /data/webapps/healthyu/ && docker pull $AZURE_CR_REGISTRY_DEV/$AZURE_CR_REPOSITORY_DEV:$IMAGE_TAG && ./run_app.sh"
          }
        }
      }
    }

    stage('Deploy on TEST') {
      when {
        branch 'test'
      }
      steps {
        echo 'Deploying on Azure Test'
        script {
          def remote = [:]
          remote.name = 'webapp_dev_server'
          remote.host = '10.211.1.5'
          remote.allowAnyHosts = true

          withCredentials([sshUserPrivateKey(
            credentialsId: 'azure-gitlab-ci', 
            keyFileVariable: 'identity', 
            passphraseVariable: '',
            usernameVariable: 'userName'
          )]) {
            remote.user = userName
            remote.identityFile = identity

            sshCommand remote: remote, command: "cd /data/webapps/healthyu/ && docker pull $AZURE_CR_REGISTRY_TEST/$AZURE_CR_REPOSITORY_TEST:$IMAGE_TAG && ./run_app.sh"
          }
        }
      }
    }

    stage('Deploy on PROD') {
      when {
        branch 'master'
      }
      steps {
        echo 'Deploying on Azure App server 1'
        script {
          def remote = [:]
          remote.name = 'HealthyU-Prod-App-Server-01'
          remote.host = '10.212.1.5'
          remote.allowAnyHosts = true

          withCredentials([sshUserPrivateKey(
            credentialsId: 'azure-gitlab-ci', 
            keyFileVariable: 'identity', 
            passphraseVariable: '',
            usernameVariable: 'userName'
          )]) {
            remote.user = userName
            remote.identityFile = identity

            sshCommand remote: remote, command: "cd /data/webapps/healthyu/ && docker pull $AZURE_CR_REGISTRY_PROD/$AZURE_CR_REPOSITORY_PROD:$IMAGE_TAG && ./run_app.sh"
          }
        }

        echo 'Deploying on Azure App server 2'
        script {
          def remote = [:]
          remote.name = 'HealthyU-Prod-App-Server-02'
          remote.host = '10.212.1.6'
          remote.allowAnyHosts = true

          withCredentials([sshUserPrivateKey(
            credentialsId: 'azure-gitlab-ci', 
            keyFileVariable: 'identity', 
            passphraseVariable: '',
            usernameVariable: 'userName'
          )]) {
            remote.user = userName
            remote.identityFile = identity

            sshCommand remote: remote, command: "cd /data/webapps/healthyu/ && docker pull $AZURE_CR_REGISTRY_PROD/$AZURE_CR_REPOSITORY_PROD:$IMAGE_TAG && ./run_app.sh"
          }
        }
      }
    }
  }

  post {
    success {
      slackSend channel: 'jenkins-build-status',
      tokenCredentialId: 'slack-login',
      username: 'Jenkins',
      teamDomain: 'g42-healthcare',
      color: 'good',
      message: "The pipeline ${PROJECT_NAME} ${GIT_BRANCH} branch commit ${GIT_COMMIT} completed successfully."
    }
    failure {
      slackSend channel: 'jenkins-build-status',
      tokenCredentialId: 'slack-login',
      username: 'Jenkins',
      teamDomain: 'g42-healthcare',
      color: 'danger',
      message: "The pipeline ${PROJECT_NAME} ${GIT_BRANCH} branch commit ${GIT_COMMIT} failed."
    }
  }

  environment {
    IMAGE_TAG = 'v1.0'
    
    PROJECT_NAME = 'healthyuae-ui'

    AZURE_CR_REGISTRY_DEV = 'healthyudev.azurecr.io'
    AZURE_CR_REPOSITORY_DEV = 'com.healthyuae/ui'

    AZURE_CR_REGISTRY_TEST = 'healthyutest.azurecr.io'
    AZURE_CR_REPOSITORY_TEST = 'com.healthyuae/ui-test'

    AZURE_CR_REGISTRY_PROD = 'healthyuprod.azurecr.io'
    AZURE_CR_REPOSITORY_PROD = 'com.healthyuae/ui-prod'
  }
}
