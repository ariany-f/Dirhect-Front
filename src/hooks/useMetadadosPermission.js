import { useState, useEffect } from 'react';
import { useSessaoUsuarioContext } from '@contexts/SessaoUsuario';
import { ArmazenadorToken } from '@utils';
import http from '@http';

export const useMetadadosPermission = () => {
    const [isLoading, setIsLoading] = useState(true);
    const { usuario } = useSessaoUsuarioContext();

    useEffect(() => {
        if (usuario.tipo) {
            // Verificar se já existe no localStorage
            const parametrosExistentes = ArmazenadorToken.ParametrosMenus;
            if (Object.keys(parametrosExistentes).length === 0) {
                // Buscar parâmetros de menus apenas se não existir
                http.get('parametros/por-assunto/?assunto=MENUS')
                    .then(response => {
                        const parametros = response.parametros || {};
                        ArmazenadorToken.definirParametrosMenus(parametros);
                        setIsLoading(false);
                    })
                    .catch(error => {
                        console.log('Erro ao buscar parâmetros de menus:', error);
                        setIsLoading(false);
                    });
            } else {
                setIsLoading(false);
            }
        }
    }, [usuario]);

    return {
        isLoading,
        metadadosDeveSerExibido: ArmazenadorToken.metadadosDeveSerExibido()
    };
}; 