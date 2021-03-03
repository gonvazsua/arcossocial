pipeline {
  agent any
  stages {

    stage('Where we are') {
      steps { 
        sh 'echo "Working on path $(pwd)"' 
        sh 'echo "List of files in the path $(ls -ltr)"' 
      }
    }

  }
}