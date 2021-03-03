pipeline {
  agent {
    docker { image 'node:latest' }
  }
  stages {

    stage('Where we are') {
      steps { sh 'echo "This is start $(pwd)"' }
    }

  }
}