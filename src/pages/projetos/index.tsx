import ProjectsList from "src/views/pages/projetos/list"

const Projects = () => {
  return <ProjectsList />
}

Projects.acl = {
  action: 'read',
  subject: 'client'
}

export default Projects
