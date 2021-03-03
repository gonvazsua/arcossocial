pipeline {
  agent any
  stages {

    stage('Where we are') {
      steps { 
        sh 'echo "We are in $(pwd)"' 
        sh 'echo "List of files here: $(ls -ltr)"' 
      }
    }

    stage('Installing arcossocialdashboard') {
      steps { 
        sh 'cd arcossocialdashboard' 
        sh 'npm install' 
      }
    }

  }
}