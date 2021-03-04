pipeline {
  agent any
  stages {

    stage('Installing arcossocialdashboard in UAT') {
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
          sh 'cp -r arcossocialdashboard $HOME/arcossocial/uat/'
        }
      }
    }

    stage('Installing arcossocialws in UAT') {
      steps {
        sh 'echo "Copying Arcos Social WS to UAT filesystem"'
        sh 'cp -r arcossocialws $HOME/arcossocial/uat/'

        dir('$HOME/arcossocial/uat/arcossocialws') {
          sh 'npm install'
          sh 'echo "********************"'
          sh 'echo "BUILD ARCOS SOCIAL WS..... OK!"'
          sh 'echo "********************"'
          sh 'echo "Showing generated files after build:"'
          sh 'echo "(ls -ltr)"'
        }

      }
    }

    stage('Deploy To PROD') {
			steps {
				script {
					def proceed = true
					try {
						timeout(time: 5, unit: 'MINUTES') {
							input "Deploy to PROD?"
						}
					} catch (err) {
						proceed = false
					}

					if (proceed) {
						stage('Installing arcossocialdashboard in PROD') {
              steps {
                dir('arcossocialdashboard') {
                  sh 'npm install'
                  sh 'npm run-script build-prod'
                  sh 'echo "********************"'
                  sh 'echo "BUILD ARCOS SOCIAL DASHBOARD..... OK!"'
                  sh 'echo "********************"'
                  sh 'echo "Showing generated files after build:"'
                  sh 'echo "(ls -ltr dist/arcossocialdashboard/)"'
                }
                dir('arcossocialdashboard/dist') {
                  sh 'echo "Copying Arcos Social Dashboard to PROD filesystem"'
                  sh 'cp -r arcossocialdashboard $HOME/arcossocial/prod/'
                }
              }
            }

            stage('Installing arcossocialws in PROD') {
              steps {
                sh 'echo "Copying Arcos Social WS to PROD filesystem"'
                sh 'cp -r arcossocialws $HOME/arcossocial/prod/'

                dir('$HOME/arcossocial/prod/arcossocialws') {
                  sh 'npm install'
                  sh 'echo "********************"'
                  sh 'echo "BUILD ARCOS SOCIAL WS..... OK!"'
                  sh 'echo "********************"'
                  sh 'echo "Showing generated files after build:"'
                  sh 'echo "(ls -ltr)"'
                }

              }
            }
					}
				}
			}
		}

  }
}