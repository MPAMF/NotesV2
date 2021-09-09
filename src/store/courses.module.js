const state = {
    courses: [
        {
            id: '52e294ac-3175-4a76-abf1-8873dbadb757',
            name: 'Architecture des Systèmes d\'Exploitation',
            notes: [
                {
                    id: 'a2298958-dc43-44d5-9343-ee88c3cc5fcc',
                    name: 'QCM',
                    notes: [
                        // Si plusieurs notes
                        {
                            // sur 4
                            id: 'a2218958-dce3-44d5-9343-ff98c3cd5fdc',
                            denominator: 4,
                            name: 'QCM 1'
                        }
                    ],
                    coeff: 1/5,
                },
                {
                    id: 'a2298958-dc43-44d5-9343-f288c3cc5fcc',
                    name: 'TP noté',
                    notes: [
                        // Si plusieurs notes
                        {
                            // sur 4
                        }
                    ],
                    coeff: 1/5,
                },
                {
                    id: 'a2298958-dc43-44d5-9343-ee88c1ec5fcc',
                    name: 'TP rendu',
                    notes: [
                        // Si plusieurs notes
                        {
                            // sur 4
                        }
                    ],
                    coeff: 0.3,
                },
                {
                    id: 'a2298958-dc43-44d5-9343-ee88c3fb5fcc',
                    name: 'CC',
                    notes: [
                        // Si plusieurs notes
                        {
                            // sur 4
                        }
                    ],
                    coeff: 0.3,
                }
            ],
            ects: 6,
            prof: 'Pierre David',
            color: '#7957D5'
        },
        {
            id: '52e294ac-3175-4a76-abf1-8273cbadb757',
            name: 'Algorithmes des Réseaux',
            notes: [
                {
                    id: 'a2298958-dc43-44d5-9343-ee88c3cc5fcc',
                    name: 'QCM',
                    notes: [
                        // Si plusieurs notes
                        {
                            // sur 4
                        }
                    ],
                    coeff: 1/5,
                },
                {
                    id: 'a2298958-dc43-44d5-9343-ee88c3cc5fcc',
                    name: 'Projet',
                    notes: [
                        // Si plusieurs notes
                        {
                            // sur 4
                        }
                    ],
                    coeff: 2/5,
                },
                {
                    id: 'a2298958-dc43-44d5-9343-ee88c3cc5fcc',
                    name: 'CC',
                    notes: [
                        // Si plusieurs notes
                        {
                            // sur 4
                        }
                    ],
                    coeff: 2/5,
                }
            ],
            ects: 3,
            prof: 'Pelsser Cristel',
            color: '#B857D5'
        },
        {
            id: '52e294ac-3175-4a76-abf1-8873dbadb727',
            name: 'Probabilités et Statistique 2',
            notes: [
                {
                    id: 'a2298958-dc43-44d5-9343-ee88c3cc5fcc',
                    name: 'QCM',
                    notes: [
                        // Si plusieurs notes
                        {
                            // sur 4
                        }
                    ],
                    coeff: 1/3,
                },
                {
                    id: 'a2298958-dc43-44d5-9343-ee88c3cc5fcc',
                    name: 'Tp noté',
                    notes: [
                        // Si plusieurs notes
                        {
                            // sur 4
                        }
                    ],
                    coeff: 1/3,
                },
                {
                    id: 'a2298958-dc43-44d5-9343-ee88c3cc5fcc',
                    name: 'CC',
                    notes: [
                        // Si plusieurs notes
                        {
                            // sur 4
                        }
                    ],
                    coeff: 1/3,
                }
            ],
            ects: 3,
            prof: 'Hechner Florian',
            color: '#D557B3'
        },
        {
            id: '52e294ac-3128-4b76-abf1-8873dbaeb757',
            name: 'Graphes',
            notes: [
                {
                    id: 'a2298958-dc43-44d5-9343-ee88c3cc5fcc',
                    name: 'CC1',
                    notes: [
                        // Si plusieurs notes
                        {
                            // sur 4
                        }
                    ],
                    coeff: 1/3,
                },
                {
                    id: 'a2298958-dc43-44d5-9343-ee88c3cc5fcc',
                    name: 'CC2',
                    notes: [
                        // Si plusieurs notes
                        {
                            // sur 4
                        }
                    ],
                    coeff: 1/3,
                },
                {
                    id: 'a2298958-dc43-44d5-9343-ee88c3cc5fcc',
                    name: 'CC3',
                    notes: [
                        // Si plusieurs notes
                        {
                            // sur 4
                        }
                    ],
                    coeff: 1/3,
                }
            ],
            ects: 3,
            prof: 'Merindol Pascal',
            color: '#D57957'
        },
        {
            id: '52e294ac-3277-4a76-abf1-8873dbadb757',
            name: 'Bases de Données 2',
            notes: [
                {
                    id: 'a2298958-dc43-44d5-9343-ee88c3cc5fcc',
                    name: 'Rendu',
                    notes: [
                        // Si plusieurs notes
                        {
                            // sur 4
                        }
                    ],
                    coeff: 1/5,
                },
                {
                    id: 'a2298958-dc43-44d5-9343-ee88c3cc5fcc',
                    name: 'Rendu',
                    notes: [
                        // Si plusieurs notes
                        {
                            // sur 4
                        }
                    ],
                    coeff: 0.3,
                },
                {
                    id: 'a2298958-dc43-44d5-9343-ee88c3cc5fcc',
                    name: 'CC',
                    notes: [
                        // Si plusieurs notes
                        {
                            // sur 4
                        }
                    ],
                    coeff: 1/2,
                }
            ],
            ects: 3,
            prof: 'Frey Gabriel',
            color: '#D5B857'
        },
        {
            id: '52e294ac-3175-4a76-aef1-8873dbfdb757',
            name: 'Génie Logiciel',
            notes: [
                {
                    id: 'a2298958-dc43-44d5-9343-ee88c3cc5fcc',
                    name: 'CC',
                    notes: [
                        // Si plusieurs notes
                        {
                            // sur 4
                        }
                    ],
                    coeff: 1/3,
                },
                {
                    id: 'a2298958-dc43-44d5-9343-ee88c3cc5fcc',
                    name: 'CC',
                    notes: [
                        // Si plusieurs notes
                        {
                            // sur 4
                        }
                    ],
                    coeff: 1/3,
                },
                {
                    id: 'a2298958-dc43-44d5-9343-ee88c3cc5fcc',
                    name: 'CC',
                    notes: [
                        // Si plusieurs notes
                        {
                            // sur 4
                        }
                    ],
                    coeff: 1/3,
                }
            ],
            ects: 3,
            prof: 'Witz Regis',
            color: '#B3D557'
        },
        {
            id: '52a294ac-3172-4a76-abf1-8873dbadb757',
            name: 'Projet Professionel de l\'Etudiant 2',
            notes: [
                {
                    id: 'a2298958-dc43-44d5-9343-ee88c3cc5fcc',
                    name: 'CC',
                    notes: [
                        // Si plusieurs notes
                        {
                            // sur 4
                        }
                    ],
                    coeff: 1/3,
                },
                {
                    id: 'a2298958-dc43-44d5-9343-ee88c3cc5fcc',
                    name: 'CC',
                    notes: [
                        // Si plusieurs notes
                        {
                            // sur 4
                        }
                    ],
                    coeff: 1/3,
                },
                {
                    id: 'a2298958-dc43-44d5-9343-ee88c3cc5fcc',
                    name: 'CC',
                    notes: [
                        // Si plusieurs notes
                        {
                            // sur 4
                        }
                    ],
                    coeff: 1/3,
                }
            ],
            ects: 3,
            prof: 'Unknown',
            color: '#74D557'
        },
        {
            id: '52b294ac-3135-4a76-abf1-8873dbadb757',
            name: 'Anglais',
            notes: [
                {
                    id: 'a2298958-dc43-44d5-9343-ee88c3cc5fcc',
                    name: 'CC',
                    notes: [
                        // Si plusieurs notes
                        {
                            // sur 4
                        }
                    ],
                    coeff: 1/3,
                },
                {
                    id: 'a2298958-dc43-44d5-9343-ee88c3cc5fcc',
                    name: 'CC',
                    notes: [
                        // Si plusieurs notes
                        {
                            // sur 4
                        }
                    ],
                    coeff: 1/3,
                },
                {
                    id: 'a2298958-dc43-44d5-9343-ee88c3cc5fcc',
                    name: 'CC',
                    notes: [
                        // Si plusieurs notes
                        {
                            // sur 4
                        }
                    ],
                    coeff: 1/3,
                }
            ],
            ects: 3,
            prof: 'Unknown',
            color: '#57D579'
        },
        {
            id: '52e224bc-3275-4a76-abf1-8873dbadb757',
            name: 'Introduction aux Grandes Catégories de Problèmes',
            notes: [
                {
                    id: 'a2298958-dc43-44d5-9343-ee88c3cc5fcc',
                    name: 'CC',
                    notes: [
                        // Si plusieurs notes
                        {
                            // sur 4
                        }
                    ],
                    coeff: 1/3,
                },
                {
                    id: 'a2298958-dc43-44d5-9343-ee88c3cc5fcc',
                    name: 'CC',
                    notes: [
                        // Si plusieurs notes
                        {
                            // sur 4
                        }
                    ],
                    coeff: 1/3,
                },
                {
                    id: 'a2298958-dc43-44d5-9343-ee88c3cc5fcc',
                    name: 'CC',
                    notes: [
                        // Si plusieurs notes
                        {
                            // sur 4
                        }
                    ],
                    coeff: 1/3,
                }
            ],
            ects: 3,
            prof: 'Schreck Pascal',
            color: '#57D5B8'
        },
    ],
    fetching: false
}

const mutations = {}

const actions = {}

const getters = {
    getCourses: state => state.courses,
    isFetching: state => state.fetching,
}

export default {
    state,
    mutations,
    actions,
    getters
}