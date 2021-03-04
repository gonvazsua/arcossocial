pipeline {
  agent any
  stages {

    stage('Installing arcossocialdashboard') {
      steps {
        dir('arcossocialdashboard') {
          sh 'npm install'
          sh 'npm run-script build'
        }
      }
    }

  }
}