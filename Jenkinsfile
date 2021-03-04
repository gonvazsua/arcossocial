pipeline {
  agent any
  stages {

    stage('Installing arcossocialdashboard') {
      steps {
        dir('arcossocialdashboard') {
          sh 'npm install'
          sh 'npm run-script build'
          sh 'echo "********************"'
          sh 'echo "BUILD ARCOS SOCIAL DASHBOARD..... OK!"'
          sh 'echo "********************"'
          sh 'echo "Showing generated files after build:"'
          sh 'echo "(ls -ltr dist/arcossocialdashboard/)"'
        }
        dir('arcossocialdashboard/dist') {
          sh 'echo "Copying Arcos Social Dashboard to UAT filesystem"'
          sh '\cp -r arcossocialdashboard $HOME/arcossocial/uat/arcossocialdashboard'
        }
      }
    }

  }
}