pipeline {
    agent none
    stages {
        stage('Build & Test') {
            agent {
                docker {
                    image 'oven/bun:latest'
                }
            }
            steps {
                script {
                    sh 'bun install'
                    sh 'bun lint'
                    sh 'bun test'
                }
            }
        }
    }
}
